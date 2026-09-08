// content.js
let isRunning = false;
let config = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    if (!isRunning) {
      isRunning = true;
      config = request.config;

      // BUG FIX #3: Clear previous run's markers so re-runs process all tweets fresh
      document.querySelectorAll('[data-cleaner-processed]').forEach(el => {
        el.removeAttribute('data-cleaner-processed');
      });

      sendResponse({ status: "started" });
      startProcess();
    }
  } else if (request.action === "stop") {
    isRunning = false;
    sendStatus("Detenido por el usuario.", true);
  }
});

function sendStatus(message, finished = false) {
  // BUG FIX #5: Popup may be closed — sendMessage throws if there's no listener
  try {
    chrome.runtime.sendMessage({ action: "statusUpdate", message, finished });
  } catch (e) {
    // Popup is closed, ignore
  }
  console.log(`[X Cleaner] ${message}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startProcess() {
  sendStatus("Analizando posts...", false);
  let processedCount = 0;
  let deletedCount = 0;
  
  while (isRunning) {
    // Find all tweets currently in the DOM
    // "article" tag is used by Twitter for tweets
    const tweets = Array.from(document.querySelectorAll('article[data-testid="tweet"]'))
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    
    let foundNew = false;

    for (const tweet of tweets) {
      if (!isRunning) break;
      
      // Skip if we've already processed this tweet in this run to avoid infinite loops
      if (tweet.hasAttribute('data-cleaner-processed')) continue;
      
      tweet.setAttribute('data-cleaner-processed', 'true');
      processedCount++;
      foundNew = true;

      if (shouldDelete(tweet)) {
        if (config.dryRun) {
          tweet.style.border = '2px solid #00ba7c';
          tweet.style.backgroundColor = 'rgba(0, 186, 124, 0.1)';
          deletedCount++;
          sendStatus(`Simulación: Encontrado ${deletedCount} coincidencia(s)...`, false);
          
          if (config.limit > 0 && deletedCount >= config.limit) {
            sendStatus(`Límite de ${config.limit} posts alcanzado (Simulación).`, true);
            isRunning = false;
            break;
          }
        } else {
          tweet.style.border = '2px solid #f4212e';
          const success = await deleteTweet(tweet);
          if (success) {
            deletedCount++;
            sendStatus(`Eliminado: ${deletedCount} post(s)...`, false);
            
            if (config.limit > 0 && deletedCount >= config.limit) {
              sendStatus(`Límite de ${config.limit} posts alcanzado. Finalizado.`, true);
              isRunning = false;
              break;
            }
            
            // BUG FIX #2: Wait for the tweet to be removed from DOM before continuing
            await sleep(300);
            await sleep(700 + Math.random() * 500); // Random delay 0.7s - 1.2s
          }
        }
      }
    }

    if (!isRunning) break;

    if (!foundNew) {
      // Scroll down to load more
      window.scrollTo(0, document.body.scrollHeight);
      sendStatus("Cargando más posts...", false);
      await sleep(2000); // wait for load
      
      // Check if we hit the bottom (no new tweets loaded)
      // This is a naive check, a robust one would compare scroll heights before and after
      const newTweets = document.querySelectorAll('article[data-testid="tweet"]:not([data-cleaner-processed])');
      if (newTweets.length === 0) {
        // Wait a bit more and check again
        await sleep(2000);
        const retryTweets = document.querySelectorAll('article[data-testid="tweet"]:not([data-cleaner-processed])');
        if(retryTweets.length === 0) {
            sendStatus(`Finalizado. Procesados: ${processedCount}. Coincidencias: ${deletedCount}.`, true);
            isRunning = false;
            break;
        }
      }
    }
  }
}

function shouldDelete(tweet) {
  if (config.deleteAll) return true;

  const textContent = tweet.textContent.toLowerCase();
  
  // 1. Keyword check
  if (config.keywords && config.keywords.trim() !== '') {
    const keywords = config.keywords.toLowerCase().split(',').map(k => k.trim()).filter(k => k !== '');
    const hasKeyword = keywords.some(keyword => textContent.includes(keyword));
    if (!hasKeyword) return false;
  }

  // 2. Type check
  const isRepost = textContent.includes('reposted') || textContent.includes('reposteó');
  const isReply = textContent.includes('replying to') || textContent.includes('en respuesta a');

  // BUG FIX #4: A tweet can be BOTH a repost AND a reply.
  // Check each type independently — allow if ANY enabled type matches.
  let typeMatched = false;
  if (isRepost && config.typeReposts) typeMatched = true;
  if (isReply && config.typeReplies) typeMatched = true;
  if (!isRepost && !isReply && config.typePosts) typeMatched = true;
  // BUG FIX #1: Likes tab support — match when on the /likes page
  if (config.typeLikes && window.location.pathname.includes('/likes')) typeMatched = true;

  if (!typeMatched) return false;

  // 3. Date check using the <time> element's ISO datetime attribute
  const timeEl = tweet.querySelector('time');
  if (timeEl && timeEl.dateTime) {
    const tweetDate = new Date(timeEl.dateTime);
    if (config.dateFrom) {
      const fromDate = new Date(config.dateFrom);
      if (tweetDate < fromDate) return false;
    }
    if (config.dateTo) {
      const toDate = new Date(config.dateTo);
      // Add 1 day to include the end date fully
      toDate.setDate(toDate.getDate() + 1);
      if (tweetDate > toDate) return false;
    }
  }

  return true;
}

async function deleteTweet(tweet) {
  try {
    // BUG FIX #1: Handle "Likes" tab — unlike instead of delete
    if (config.typeLikes && window.location.pathname.includes('/likes')) {
      const unlikeBtn = tweet.querySelector('[data-testid="unlike"]');
      if (unlikeBtn) {
        unlikeBtn.click();
        await sleep(300);
        return true;
      }
      return false;
    }

    // 1. Click "More" menu on the tweet using data-testid (language agnostic)
    const moreBtn = tweet.querySelector('[data-testid="caret"]');
    if (!moreBtn) return false;
    moreBtn.click();
    
    // Wait for the React dropdown to fully render
    await sleep(600);

    // 2. Find and click "Delete" in the dropdown
    // We look for role="menuitem" and check for the Trash icon SVG path, making it language independent.
    // Fallback to text matching just in case.
    const menus = document.querySelectorAll('[role="menuitem"]');
    let deleteBtn = null;
    const trashSvgPath = 'M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 5.77 22 7.34 22h9.32c1.57 0 2.36-1.22 2.47-2.79L20 8h1V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.52-.35.93-.81.93H7.34c-.46 0-.77-.41-.81-.93L5.7 8h12.6l-.84 11.07zM9 10h2v8H9v-8zm4 0h2v8h-2v-8z';
    
    for (const menu of menus) {
      const html = menu.innerHTML;
      const text = menu.textContent.toLowerCase();
      if (html.includes(trashSvgPath) || text.includes('delete') || text.includes('eliminar') || text.includes('borrar')) {
        deleteBtn = menu;
        break;
      }
    }
    
    if (!deleteBtn) {
        // Close menu if it's not a deletable tweet (e.g. someone else's tweet)
        document.body.click(); 
        return false;
    }
    
    deleteBtn.click();
    
    // Wait for the confirmation modal to appear
    await sleep(700);

    // 3. Confirm Delete using data-testid
    const confirmBtn = document.querySelector('[data-testid="confirmationSheetConfirm"]');
    if (confirmBtn) {
      confirmBtn.click();
      return true;
    }
    
    // If confirmation button didn't appear by testid, try by closing the modal just in case
    document.body.click();
    return false;
  } catch (err) {
    console.error("Error deleting tweet", err);
    return false;
  }
}
