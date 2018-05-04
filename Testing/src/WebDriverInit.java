import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class WebDriverInit {
    WebDriver driver;

    public WebDriver getDriver() {
        return driver;
    }


    public WebDriverInit(){
        String currentDir = System.getProperty("user.dir");
        System.out.println(currentDir);
        File file = (new File(currentDir)).getParentFile();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("load-extension="+file.getAbsoluteFile());
        DesiredCapabilities capabilities = new DesiredCapabilities();
        capabilities.setCapability(ChromeOptions.CAPABILITY, options);
        System.setProperty("webdriver.chrome.driver", "chromedriver.exe");
        driver = new ChromeDriver(capabilities);
    }

    public List<String> searchQueryTitle(String s) throws InterruptedException {
        List<String> title = new ArrayList<>();
        syncSearch(s);
        List<WebElement> resultBox = driver.findElements(By.id("thumbnailContainer"));
        System.out.println(resultBox.size());
        Actions action = new Actions(driver);
        for(int i = 0 ; i<resultBox.size();i++){
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
        WebElement resultBox = driver.findElement(By.id("searchResults"));
        for (WebElement webElement : resultBox.findElements(By.xpath("//*[@id=\"thumbnailContainer\"]/img"))) {
            title.add(webElement.getAttribute("src"));
        }
        return title;
    }

    private void syncSearch(String s) throws InterruptedException {
        driver.get("http://www.google.com/xhtml");
        WebElement searchBox = driver.findElement(By.name("q"));
        WebElement youtubeSearchBox = driver.findElement(By.id("query"));
        youtubeSearchBox.sendKeys(s);
        youtubeSearchBox.sendKeys(Keys.ENTER);
        Thread.currentThread().sleep(1000);
    }

    public void Dragging(int x, int y) throws InterruptedException {
        driver.get("http://www.google.com/xhtml");
        WebElement youtubeSearchBox = driver.findElement(By.id("query"));
        Actions action = new Actions(driver);
        action.clickAndHold(youtubeSearchBox).moveByOffset(x, y).release().build().perform();
    }

    public void Resizing(int x, int y) throws InterruptedException {
        driver.get("http://www.google.com/xhtml");
        WebElement youtubeSearchBox = driver.findElement(By.id("resizer"));
        Actions action = new Actions(driver);
        action.clickAndHold(youtubeSearchBox).moveByOffset(x, y).release().build().perform();
    }

    public static void main(String[] args) throws InterruptedException {
        WebDriverInit webDriverInit = new WebDriverInit();
//        webDriverInit.Resizing(100,200);

    }
}
