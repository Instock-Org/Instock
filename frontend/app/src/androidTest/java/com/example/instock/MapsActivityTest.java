package com.example.instock;

import android.content.Intent;
import android.graphics.Rect;
import android.os.Bundle;
import android.support.test.filters.LargeTest;
import android.support.test.rule.ActivityTestRule;
import android.support.test.runner.AndroidJUnit4;
import android.support.test.uiautomator.UiDevice;
import android.support.test.uiautomator.UiObject;
import android.support.test.uiautomator.UiObjectNotFoundException;
import android.support.test.uiautomator.UiSelector;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import static android.support.test.InstrumentationRegistry.getInstrumentation;
import static android.support.test.espresso.Espresso.onView;
import static android.support.test.espresso.action.ViewActions.click;
import static android.support.test.espresso.assertion.ViewAssertions.matches;
import static android.support.test.espresso.matcher.ViewMatchers.isDisplayed;
import static android.support.test.espresso.matcher.ViewMatchers.withId;


@RunWith(AndroidJUnit4.class)
@LargeTest
public class MapsActivityTest {

    @Rule
    public ActivityTestRule<MapsActivity> activityRule =
            new ActivityTestRule<>(MapsActivity.class, false, false);

    public void initSingleStore() {
        Store store = new Store();
        store.setLat(49.2605024);
        store.setLng(-123.2476207);
        store.setName("Forestry's Groceries");

        List<Store> stores = new ArrayList<>();
        stores.add(store);

        FewestStoresResponse res = new FewestStoresResponse();
        res.setStores(stores);

        Bundle bundle = new Bundle();
        bundle.putSerializable("STORES", (Serializable)res.getStores());

        Intent intent = new Intent();
        intent.putExtra("BUNDLE", bundle);
        activityRule.launchActivity(intent);
    }

    public void initMultipleStores() {
        Store store = new Store();
        store.setLat(49.2605024);
        store.setLng(-123.2476207);
        store.setName("Forestry's Groceries");

        Store store2 = new Store();
        store2.setLat(48.2605024);
        store2.setLng(-124.2476207);
        store2.setName("Karn's Groceries");

        Store store3 = new Store();
        store3.setLat(47.2605024);
        store3.setLng(-125.2476207);
        store3.setName("Megan's Groceries");

        List<Store> stores = new ArrayList<>();
        stores.add(store);
        stores.add(store2);
        stores.add(store3);

        FewestStoresResponse res = new FewestStoresResponse();
        res.setStores(stores);

        Bundle bundle = new Bundle();
        bundle.putSerializable("STORES", (Serializable)res.getStores());

        Intent intent = new Intent();
        intent.putExtra("BUNDLE", bundle);
        activityRule.launchActivity(intent);
    }

    @Test
    public void mapsFragmentDisplayed() {
        initSingleStore();
        onView(withId(R.id.map)).check(matches(isDisplayed()));
        onView(withId(R.id.map)).perform(click());
    }

    @Test
    public void singleMarkerDisplayed() throws UiObjectNotFoundException {
        initSingleStore();
        UiDevice device = UiDevice.getInstance(getInstrumentation());
        UiObject marker = device.findObject(new UiSelector().descriptionContains("Forestry's Groceries"));
        marker.click();
    }

    @Test
    public void multipleMarkerDisplayed() throws UiObjectNotFoundException {
        initMultipleStores();
        UiDevice device = UiDevice.getInstance(getInstrumentation());

        UiObject marker = device.findObject(new UiSelector().descriptionContains("Forestry's Groceries"));
        marker.click();

        UiObject marker2 = device.findObject(new UiSelector().descriptionContains("Karn's Groceries"));
        marker2.click();

        UiObject marker3 = device.findObject(new UiSelector().descriptionContains("Megan's Groceries"));
        marker3.click();
    }

    @Test
    public void mapMarkerInfoWindowDisplayed() throws UiObjectNotFoundException {
        initSingleStore();
        UiDevice device = UiDevice.getInstance(getInstrumentation());
        UiObject marker = device.findObject(new UiSelector().descriptionContains("Forestry's Groceries"));
        marker.click();
        marker.clickTopLeft();
        Rect rects = marker.getBounds();
        device.click(rects.centerX(), rects.top - 30);
    }
}