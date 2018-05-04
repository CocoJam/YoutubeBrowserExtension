import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.util.List;

public class youtubeDriver {
    WebDriver driver;
    public youtubeDriver() {
        driver = new ChromeDriver();
        driver.get("https://www.youtube.com/");
    }
    public WebElement initalElement(String s){
        WebElement youtubeSearch = driver.findElement(By.id("search"));
        youtubeSearch.sendKeys(s);
        youtubeSearch.sendKeys(Keys.ENTER);
        return driver.findElement(By.id("dismissable"));
    }

    public List<WebElement> checkTitle(String s){
      return initalElement(s).findElements(By.xpath("//a[@class='yt-simple-endpoint style-scope ytd-video-renderer']"));
    }

    public List<WebElement> checkThumb(String s){
        return initalElement(s).findElements(By.xpath("//img[@class='style-scope yt-img-shadow']"));
    }
}

