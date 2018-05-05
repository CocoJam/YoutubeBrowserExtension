import org.openqa.selenium.WebDriver;

import java.awt.*;
import java.awt.event.KeyEvent;
import java.util.ArrayList;

public class tabsSwitch {
    webDriverInit webDriverInit = new webDriverInit();
    WebDriver driver = webDriverInit.driver;
    public void createNewTab(String s) throws AWTException, InterruptedException {
        //https://sqa.stackexchange.com/questions/24682/how-to-open-new-tab-in-browser-in-selenium-3-0
        webDriverInit.syncSearch(s);
        Robot robot = new Robot();
        robot.keyPress(KeyEvent.VK_CONTROL);
        robot.keyPress(KeyEvent.VK_T);
        robot.keyRelease(KeyEvent.VK_CONTROL);
        robot.keyRelease(KeyEvent.VK_T);
    }

    public void switchTabs(int n){
        ArrayList<String> newTab = new ArrayList<String>(driver.getWindowHandles());
        try {
            driver.switchTo().window(newTab.get(n));
        }
        catch (IndexOutOfBoundsException e){
            e.printStackTrace();
            driver.switchTo().window(newTab.get(newTab.size()-1));
        }
    }

    public void tabChangeCheck(String s,String s1) throws InterruptedException, AWTException {
        createNewTab(s);
        ArrayList<String> newTab = new ArrayList<String>(driver.getWindowHandles());
        System.out.println(newTab.size());
        switchTabs(newTab.size()-1);
        webDriverInit.syncSearch(s1);
    }

    public static void main(String[] args) throws AWTException, InterruptedException {
        tabsSwitch tabsSwitch = new tabsSwitch();
        tabsSwitch.tabChangeCheck("Hello", "Bye");
//        tabsSwitch.webDriverInit.searchAndView("You",2);
//        tabsSwitch.webDriverInit.Resizing(100,200);
    }
}
