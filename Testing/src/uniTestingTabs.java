import org.junit.*;

import java.awt.*;
import java.util.List;
public class uniTestingTabs {
    tabsSwitch tabsSwitch = null;
    String s = "Bye";
    @Before
    public void setUp (){
        tabsSwitch = new tabsSwitch();
    }
    @Test
    public void tabsCreate() throws AWTException {
       tabsSwitch.createNewTab(s);

    }
    @After
    public void cleanUp (){
        tabsSwitch.driver.close();
    }
}
