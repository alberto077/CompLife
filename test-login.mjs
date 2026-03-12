import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('response', response => {
    if(!response.ok()) console.log(`RESPONSE ERROR: ${response.url()} - ${response.status()}`);
  });

  await page.goto('http://localhost:3000');
  
  console.log("Clicking Demo Login...");
  
  // Find the button with text "Try Demo Account"
  const [button] = await page.$x("//button[contains(., 'Try Demo Account')]");
  if (button) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(() => console.log("No navigation or timed out")),
      button.click()
    ]);
  } else {
    console.log("Button not found.");
  }
  
  console.log("Final URL:", page.url());
  
  await browser.close();
})();
