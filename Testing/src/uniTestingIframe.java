import org.junit.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class uniTestingIframe {
    webDriverInit webDriverInit = null;
    int h = 200;
    int w = 200;
    String s = "Hello there";
    @Before
    public void setUp() {
        webDriverInit = new webDriverInit();
    }

    @Test
    public void playVideo(){
        webDriverInit.syncSearch(s);
        Assert.assertTrue(true);
    }

    @Test
    public void playVideoById(){
        String videoid = webDriverInit.searchAndView(s,1);
        webDriverInit.driver.get("https://www.youtube.com/watch?v="+videoid);
       Assert.assertTrue(true);
    }


    @Test
    public void Resizing() {

        try{
        webDriverInit.Resizing(w, h);
        }
        catch (Exception e){
            e.printStackTrace();
            Assert.fail();
        }
        Assert.assertTrue(true);
    }

    @Test
    public void Dragging(){
        try{webDriverInit.Dragging(w,h);}
        catch (Exception e){
            e.printStackTrace();
            Assert.fail();
        }
        Assert.assertTrue(true);
    }

    @Test
    public void DraggingThroughTabs() throws InterruptedException {
        try{webDriverInit.Dragging(w,h);
        }
        catch (Exception e){
            e.printStackTrace();
            Assert.fail();
        }
        String L1 = webDriverInit.getCurrentIframeleft();
        String T1 = webDriverInit.getCurrentIframeTop();
        WebElement searchBox = webDriverInit.driver.findElement(By.name("q"));
        searchBox.sendKeys(s);
        searchBox.submit();
        Thread.currentThread().sleep(1000);
        String L2 = webDriverInit.getCurrentIframeleft();
        String T2 = webDriverInit.getCurrentIframeTop();
        Assert.assertEquals(L1,L2);
        Assert.assertEquals(T1,T2);
    }
    @Test
    public void ResizingThroughTabs() throws InterruptedException {
        try{webDriverInit.Resizing(w,h);
        }
        catch (Exception e){
            e.printStackTrace();
            Assert.fail();
        }
        String W1 = webDriverInit.getCurrentIframewidth();
        String H1 = webDriverInit.getCurrentIframeheight();
        WebElement searchBox = webDriverInit.driver.findElement(By.name("q"));
        searchBox.sendKeys(s);
        searchBox.submit();
        Thread.currentThread().sleep(1000);
        String W2 = webDriverInit.getCurrentIframewidth();
        String H2 = webDriverInit.getCurrentIframeheight();
        Assert.assertEquals(W1,W2);
        Assert.assertEquals(H1,H2);
    }


    @After
    public void cleanUp() {
        webDriverInit.driver.close();
    }
}
