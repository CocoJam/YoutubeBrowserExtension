import org.junit.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.awt.*;
import java.awt.event.KeyEvent;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class uniTestingTabs {
    tabsSwitch tabsSwitch = null;
    String s = "Bye";
    int h = 200;
    int w = 200;
    @Before
    public void setUp (){
        tabsSwitch = new tabsSwitch();
    }
    @Test
    public void tabsCreate() throws AWTException {
       int t1 = tabsSwitch.tabNum();
       tabsSwitch.createNewTab(s);
        int t2 = tabsSwitch.tabNum();
        Assert.assertEquals(t1+1, t2);
    }
    @Test
    public void tabsSwitchDragging() throws AWTException, InterruptedException {

        try{tabsSwitch.webDriverInit.Dragging(w,h);
        }
        catch (Exception e){
            e.printStackTrace();
            Assert.fail();
        }
        String L1 = tabsSwitch.webDriverInit.getCurrentIframeleft();
        String T1 =tabsSwitch.webDriverInit.getCurrentIframeTop();
        tabsSwitch.createNewTab(s);
        tabsSwitch.createNewTab(s);
//        Thread.currentThread().sleep(1000);
        tabsSwitch.switchTabs(1);
        tabsSwitch.driver.get("https://www.google.com/");
        Thread.currentThread().sleep(1000);
        String L2 = tabsSwitch.webDriverInit.getCurrentIframeleft();
        String T2 = tabsSwitch.webDriverInit.getCurrentIframeTop();
        Assert.assertEquals(L1,L2);
        Assert.assertEquals(T1,T2);
    }

    @Test
    public void tabsSwitchResizing() throws AWTException, InterruptedException {

        try{tabsSwitch.webDriverInit.Resizing(w,h);
        }
        catch (Exception e){
            e.printStackTrace();
            Assert.fail();
        }
        String L1 = tabsSwitch.webDriverInit.getCurrentIframeheight();
        String T1 =tabsSwitch.webDriverInit.getCurrentIframewidth();
        tabsSwitch.createNewTab(s);
        tabsSwitch.createNewTab(s);
//        Thread.currentThread().sleep(1000);
        tabsSwitch.switchTabs(1);
        tabsSwitch.driver.get("https://www.google.com/");
        Thread.currentThread().sleep(1000);
        String L2 = tabsSwitch.webDriverInit.getCurrentIframeheight();
        String T2 = tabsSwitch.webDriverInit.getCurrentIframewidth();
        Assert.assertEquals(L1,L2);
        Assert.assertEquals(T1,T2);
    }

    @After
    public void cleanUp (){
        tabsSwitch.driver.close();
    }
}
