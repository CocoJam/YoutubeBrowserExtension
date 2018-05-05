import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class WebDriverInit {
    WebDriver driver;

    public WebDriver getDriver() {
        return driver;
    }


    public WebDriverInit() {
        String currentDir = System.getProperty("user.dir");
        System.out.println(currentDir);
        File file = (new File(currentDir)).getParentFile();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("load-extension=" + file.getAbsoluteFile());
        DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setCapability(ChromeOptions.CAPABILITY, options);
        System.setProperty("webdriver.chrome.driver", "chromedriver.exe");
        driver = new ChromeDriver(capabilities);
    }

    public void searchAndView(String s, int n){
        syncSearch(s);
        List<WebElement> resultBox = ListimplictWait("thumbnailContainer");
        resultBox.get(n).click();
    }

    public WebElement implictWait(String s){
        WebDriverWait wait = new WebDriverWait(driver, 50);
        WebElement element= wait.until(ExpectedConditions.presenceOfElementLocated(By.id(s)));
        return element;
    }

    public List<WebElement> ListimplictWait(String s){
        WebDriverWait wait = new WebDriverWait(driver, 20);
       List<WebElement> element= wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.id(s)));
        return element;
    }

    public List<String> searchQueryTitle(String s) {
        List<String> title = new ArrayList<>();
        syncSearch(s);
        List<WebElement> resultBox = ListimplictWait("thumbnailContainer");
        System.out.println(resultBox.size());
        Actions action = new Actions(driver);
        for (int i = 0; i < resultBox.size(); i++) {
            action.moveToElement(resultBox.get(i)).perform();
            List<WebElement> result = driver.findElements(By.id("videoTitle"));
            System.out.println(result.get(i).getText());
            title.add(result.get(i).getText());
        }
        return title;
    }

    public List<String> searchQueryImgSrc(String s) throws InterruptedException {
        List<String> title = new ArrayList<>();
        syncSearch(s);
        List<WebElement> resultBox = ListimplictWait("thumbnailContainer");
        for (WebElement box : resultBox) {
          title.add(box.findElement(By.tagName("img")).getAttribute("src"));
        }
        return title;
    }

    public void syncSearch(String s) {
        driver.get("http://www.google.com/xhtml");
        WebElement searchBox = driver.findElement(By.name("q"));
        WebElement youtubeSearchBox = implictWait("query");
        youtubeSearchBox.sendKeys(s);
        youtubeSearchBox.sendKeys(Keys.ENTER);
    }

    public void Dragging(int x, int y) {
        driver.get("http://www.google.com/xhtml");
        WebElement youtubeSearchBox = driver.findElement(By.id("query"));
        Actions action = new Actions(driver);
        action.clickAndHold(youtubeSearchBox).moveByOffset(x, y).release().build().perform();
    }

    public void Resizing(int x, int y){
        driver.get("http://www.google.com/xhtml");
        WebElement youtubeSearchBox = implictWait("resize");
        Actions action = new Actions(driver);
        action.clickAndHold(youtubeSearchBox).moveByOffset(x, y).release().build().perform();
    }

    public String getCurrentVideoId() {
        WebElement currentVideoId = getCurrentIframe();
        String VideoId = currentVideoId.getAttribute("src");
        System.out.println(VideoId);
        return VideoId;
    }

    public String getCurrentIframewidth() {
        WebElement currentVideoId = getCurrentIframe();
        String width = currentVideoId.getAttribute("width");
        return width;
    }

    public String getCurrentIframeheight() {
        WebElement currentVideoId = getCurrentIframe();
        String height = currentVideoId.getAttribute("height");
        return height;
    }

    public WebElement getCurrentIframe() {
        return implictWait("player");
    }

    public static void main(String[] args){
        WebDriverInit webDriverInit = new WebDriverInit();
        webDriverInit.searchQueryTitle("Bye");
        youtubeDriver youtubeDriver = new youtubeDriver();
        for (String element : youtubeDriver.checkTitle("Bye")) {
            System.out.println(element);
        }
    }
}
