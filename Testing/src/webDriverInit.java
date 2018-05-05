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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class webDriverInit {
    WebDriver driver;

    public WebDriver getDriver() {
        return driver;
    }


    public webDriverInit() {
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

    public String searchAndView(String s, int n){
        syncSearch(s);
        List<WebElement> resultBox = ListImplicitWait("thumbnailContainer");
        resultBox.get(n).click();
        return getSearchAndViewVideoID(resultBox,n);
    }

    public String getSearchAndViewVideoID(List<WebElement> webElements, int n){

        Pattern pattern = Pattern.compile("vi/(.+)/", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher( webElements.get(n).findElement(By.tagName("img")).getAttribute("src"));
        if (matcher.find()) {
          return matcher.group(1);
        }
       return "";
    }

    public WebElement implicitWait(String s){
        WebDriverWait wait = new WebDriverWait(driver, 10);
        WebElement element= wait.until(ExpectedConditions.presenceOfElementLocated(By.id(s)));
        return element;
    }

    public List<WebElement> ListImplicitWait(String s){
        WebDriverWait wait = new WebDriverWait(driver, 10);
       List<WebElement> element= wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.id(s)));
        return element;
    }

    public List<String> searchQueryTitle(String s) {
        List<String> title = new ArrayList<>();
        syncSearch(s);
        List<WebElement> resultBox = ListImplicitWait("thumbnailContainer");
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

    public List<WebElement> searchQueryImgSrc(String s) {
        List<WebElement> title = new ArrayList<>();
        syncSearch(s);
        List<WebElement> resultBox = ListImplicitWait("thumbnailContainer");
        for (WebElement box : resultBox) {
          title.add(box.findElement(By.tagName("img")));
        }
        return title;
    }

    public void syncSearch(String s) {
        driver.get("http://www.google.com/xhtml");
        WebElement youtubeSearchBox = implicitWait("query");
        youtubeSearchBox.sendKeys(s);
        youtubeSearchBox.sendKeys(Keys.ENTER);
    }

    public void Dragging(int x, int y) {
        driver.get("http://www.google.com/xhtml");
        WebElement youtubeSearchBox =implicitWait("query");
        Actions action = new Actions(driver);
        action.clickAndHold(youtubeSearchBox).moveByOffset(x, y).release().build().perform();
    }

    public void Resizing(int x, int y){
        driver.get("http://www.google.com/xhtml");
        WebElement youtubeSearchBox = implicitWait("resizer");
        Actions action = new Actions(driver);
        action.clickAndHold(youtubeSearchBox).moveByOffset(x, y).release().build().perform();
    }

    public String getCurrentVideoId() {
        WebElement currentVideoId = implicitWait("player");
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

    public String getCurrentIframeTop() {
        WebElement currentVideoId = getCurrentIframe();
        String height = currentVideoId.getCssValue("top");
        return height;
    }
    public String getCurrentIframeleft() {
        WebElement currentVideoId = getCurrentIframe();
        String height = currentVideoId.getCssValue("left");
        return height;
    }

    public WebElement getCurrentIframe() {
        return implicitWait("grandParentDiv");
    }

    public static void main(String[] args){
        webDriverInit webDriverInit = new webDriverInit();
//        webDriverInit.driver.get("http://www.google.com/xhtml");
        webDriverInit.Dragging(100,200);
    }
}
