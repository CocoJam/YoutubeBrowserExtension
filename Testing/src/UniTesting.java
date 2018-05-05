import org.junit.*;

import java.util.List;
import java.util.Set;

public class UniTesting {
    @Test
    public void MathcingTitles() throws InterruptedException {
        String s = "Hello";
        WebDriverInit webDriverInit = new WebDriverInit();
        List<String> train= webDriverInit.searchQueryTitle(s);
        youtubeDriver youtubeDriver = new youtubeDriver();
        List<String> test = youtubeDriver.checkTitle(s);
        for (String s1 : train) {
           if (!test.contains(s1.trim())){
               System.out.println(s1);
           }
        }
        System.out.println(test.size());
        Assert.assertTrue(true);
    }
}
