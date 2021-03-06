import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class youtubeDriver {
    WebDriver driver;
    //Set up youtube webDrvier that browse to youtube.com
    public youtubeDriver() {
        System.setProperty("webdriver.chrome.driver", "chromedriver.exe");
        driver = new ChromeDriver();
        driver.get("https://www.youtube.com/");
    }
    //search and return the first dsmissable element from youtube
    public WebElement initialElement(String s) {
        WebElement youtubeSearch = driver.findElement(By.id("search"));
        youtubeSearch.sendKeys(s);
        youtubeSearch.sendKeys(Keys.ENTER);
        return driver.findElement(By.id("dismissable"));
    }
    //go to youtube and search a query and get all the titles shown at that moment
    public List<String> checkTitle(String s) {
        initialElement(s);
        List<String> string = new ArrayList<>();
        for (WebElement element : ListImplicitWait("//*[@id=\"video-title\"]")) {
            string.add(element.getText());
        }
        return string;
    }
    //Implicit wait is a selenium function to wait for a set time with 500 mili sec interval check for specific element
    //If given time is not find the element it will through an error. This waits for a list.
    public List<WebElement> ListImplicitWait(String s) {
        WebDriverWait wait = new WebDriverWait(driver, 20);
        List<WebElement> element = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.xpath(s)));
        return element;
    }
    //go to youtube and search a query and get all the thumbnails img and filter by youtube video id shown at that moment
    public List<String> checkThumb(String s) {
        initialElement(s);
        return filteringThumbnails(ListImplicitWait("//*[@id=\"img\"]"));
    }
    //filter using regex, due to the given img used in the browser extension is different to youtube search itself.
    //This is due to the quality image used, hence check for image video id instead.
    public static List<String> filteringThumbnails(List<WebElement> webElement) {
        List<String> s = new ArrayList<>();
        String vId = null;
        Pattern pattern = Pattern.compile("vi/(.+)/", Pattern.CASE_INSENSITIVE);
        for (WebElement element : webElement) {
            if (element != null) {
                Matcher matcher;
                try{
                matcher = pattern.matcher(element.getAttribute("src"));}
                catch (NullPointerException e){
                    break;
                }
                if (matcher.find()) {
                    vId = matcher.group(1);
                    s.add(vId);
                }
            }
        }
        return s;
    }

    public static void main(String[] args) {
        youtubeDriver youtubeDriver = new youtubeDriver();

        for (String element : youtubeDriver.checkTitle("Hello")) {
            System.out.println(element);
        }
        webDriverInit webDriverInit =new webDriverInit();
        webDriverInit.searchQueryTitle("Hello");

    }
}

