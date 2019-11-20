package com.example.instock;

import android.support.test.filters.LargeTest;
import android.support.test.rule.ActivityTestRule;
import android.support.test.runner.AndroidJUnit4;
import android.support.test.uiautomator.By;
import android.support.test.uiautomator.UiDevice;
import android.support.test.uiautomator.UiObject2;
import android.support.test.uiautomator.Until;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static android.support.test.InstrumentationRegistry.getInstrumentation;
import static android.support.test.espresso.Espresso.onView;
import static android.support.test.espresso.assertion.ViewAssertions.matches;
import static android.support.test.espresso.matcher.ViewMatchers.isDisplayed;
import static android.support.test.espresso.matcher.ViewMatchers.withId;
import static org.junit.Assert.assertEquals;


@RunWith(AndroidJUnit4.class)
@LargeTest
public class PushNotificationsTest {

    @Rule
    public ActivityTestRule<UserViewActivity> activityRule =
            new ActivityTestRule<>(UserViewActivity.class);

    @Test
    public void notificationReceived() {
        UiDevice device = UiDevice.getInstance(getInstrumentation());
        device.openNotification();
        device.wait(Until.hasObject(By.text("Title")), 7000);
        UiObject2 title = device.findObject(By.text("Title"));
    }

    @Test
    public void notificationContentCorrect() {
        UiDevice device = UiDevice.getInstance(getInstrumentation());
        device.openNotification();
        device.wait(Until.hasObject(By.text("Title2")), 7000);
        UiObject2 title = device.findObject(By.text("Title2"));
        UiObject2 text = device.findObject(By.text("text"));
        assertEquals("Title2", title.getText());
        assertEquals("text", text.getText());
    }

    @Test
    public void notificationClicked() {
        UiDevice device = UiDevice.getInstance(getInstrumentation());
        device.openNotification();
        device.wait(Until.hasObject(By.text("Title3")), 7000);
        UiObject2 title = device.findObject(By.text("Title3"));
        title.click();
        device.wait(Until.hasObject(By.textStartsWith("Log")), 1000);

        // Check clicking notification has brought us to StartActivity
        onView(withId(R.id.start_login_user)).check(matches(isDisplayed()));
        onView(withId(R.id.start_login_employee)).check(matches(isDisplayed()));

    }
}
