import org.junit.*;

import java.util.List;

public class uniTesting {
    String s = "Hello";
    webDriverInit webDriverInit = null;
    youtubeDriver youtubeDriver = null;

    @Before
    public void setUp() {
        webDriverInit = new webDriverInit();
        youtubeDriver = new youtubeDriver();
    }

    @Test
    public void matchingTitles() throws InterruptedException {
        List<String> test = webDriverInit.searchQueryTitle(s);
        List<String> train = youtubeDriver.checkTitle(s);
        for (String s1 : test) {
           if (!train.contains(s1.trim())){
               System.out.println(s1);
               Assert.fail();
           }
        }
        System.out.println(train.size());
        Assert.assertTrue(true);
    }

    @Test
    public void matchingThumbnail () {
        List<String> test = youtubeDriver.filteringThumbnails(webDriverInit.searchQueryImgSrc(s));
        List<String> train = youtubeDriver.checkThumb(s);
        for (String s1 : test) {
            if (!train.contains(s1.trim())){
                System.out.println(s1);
                Assert.fail();
            }
        }
        System.out.println(train.size());
        Assert.assertTrue(true);

    }


    @After
    public void cleanUp() {
        webDriverInit.driver.close();
        youtubeDriver.driver.close();
    }

}
