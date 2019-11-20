package com.example.instock;

import android.support.test.espresso.intent.Intents;
import android.support.test.filters.LargeTest;
import android.support.test.rule.ActivityTestRule;
import android.support.test.runner.AndroidJUnit4;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static android.support.test.espresso.Espresso.onView;
import static android.support.test.espresso.action.ViewActions.click;
import static android.support.test.espresso.action.ViewActions.typeText;
import static android.support.test.espresso.assertion.ViewAssertions.matches;
import static android.support.test.espresso.intent.Intents.intended;
import static android.support.test.espresso.intent.matcher.IntentMatchers.hasComponent;
import static android.support.test.espresso.matcher.RootMatchers.isDialog;
import static android.support.test.espresso.matcher.ViewMatchers.isDisplayed;
import static android.support.test.espresso.matcher.ViewMatchers.isEnabled;
import static android.support.test.espresso.matcher.ViewMatchers.withId;
import static android.support.test.espresso.matcher.ViewMatchers.withText;


@RunWith(AndroidJUnit4.class)
@LargeTest
public class Test1 {

    @Before
    public void initIntent() {
        Intents.init();
    }

    @After
    public void releaseInit() {
        Intents.release();
    }

    @Rule
    public ActivityTestRule<ShoppingListActivity> activityRule =
            new ActivityTestRule<>(ShoppingListActivity.class);

    @Test
    public void addItemButtonEnabled() {
        onView(withId(R.id.action_add_item)).check(matches(isDisplayed()));
        onView(withId(R.id.action_add_item)).check(matches(isEnabled()));
    }

    @Test
    public void sendListButtonEnabled() {
        onView(withId(R.id.action_add_item)).check(matches(isEnabled()));
        onView(withId(R.id.action_add_item)).perform(click());
        onView(withId(R.id.add_edit_text)).perform(click()).perform(typeText("apple"));
        onView(withText("ADD")).inRoot(isDialog()).check(matches(isDisplayed())).perform(click());
        onView(withId(R.id.list_send_button)).check(matches(isDisplayed()));
        onView(withId(R.id.list_send_button)).check(matches(isEnabled()));
    }

    @Test
    public void launchShoppingTrip() {
        onView(withId(R.id.list_send_button)).check(matches(isEnabled()));
        onView(withId(R.id.list_send_button)).perform(click());

        intended(hasComponent(ShoppingTripActivity.class.getName()));
    }

    @Test
    public void mapsViewButtonEnabled() {
        onView(withId(R.id.list_send_button)).check(matches(isEnabled()));
        onView(withId(R.id.list_send_button)).perform(click());

        onView(withId(R.id.trip_maps_button)).check(matches(isDisplayed()));
        onView(withId(R.id.trip_maps_button)).check(matches(isEnabled()));
    }

    @Test
    public void mapsViewLaunches () {
        onView(withId(R.id.list_send_button)).check(matches(isEnabled()));
        onView(withId(R.id.list_send_button)).perform(click());

        onView(withId(R.id.trip_maps_button)).check(matches(isEnabled()));
        onView(withId(R.id.trip_maps_button)).perform(click());

        intended(hasComponent(MapsActivity.class.getName()));
    }
}