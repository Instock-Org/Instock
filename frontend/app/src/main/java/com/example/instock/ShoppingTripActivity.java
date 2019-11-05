package com.example.instock;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
//import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ExpandableListView;
import android.widget.ExpandableListAdapter;
//import android.widget.ExpandableListView;
//import android.widget.Toast;
//import android.widget.ListView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ShoppingTripActivity extends AppCompatActivity {

    ExpandableListView expandableListView;
    ExpandableListAdapter expandableListAdapter;
    List<String> expandableListTitle;
    HashMap<String, List<String>> expandableListDetail;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        overridePendingTransition(R.transition.slide_from_right, R.transition.slide_to_left);
        setContentView(R.layout.activity_shopping_trip);

        // Get stores list from intent
        Intent intent = getIntent();
        final Bundle args = intent.getBundleExtra("BUNDLE");
        List<Store> stores = (List<Store>) args.getSerializable("STORES");
//        Log.d("ShoppingTripActivity", stores.get(0).getName());

        Button mapsViewButton = findViewById(R.id.trip_maps_button);
        mapsViewButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ShoppingTripActivity.this, MapsActivity.class);
                intent.putExtra("BUNDLE", args);
                startActivity(intent);
            }
        });

        expandableListView = (ExpandableListView) findViewById(R.id.trip_stores_list);
        expandableListDetail = ExpandableListData.getData(stores);
        expandableListTitle = new ArrayList<String>(expandableListDetail.keySet());
        expandableListAdapter = new CustomExpandableListAdapter(this, expandableListTitle, expandableListDetail);
        expandableListView.setAdapter(expandableListAdapter);
        expandableListView.setOnGroupExpandListener(new ExpandableListView.OnGroupExpandListener() {

            @Override
            public void onGroupExpand(int groupPosition) {
                Log.d("ShoppingTripActivity", "reached onGroupExpand");
            }
        });

        expandableListView.setOnGroupCollapseListener(new ExpandableListView.OnGroupCollapseListener() {

            @Override
            public void onGroupCollapse(int groupPosition) {
                Log.d("ShoppingTripActivity", "reached onGroupCollapse");
            }
        });

        expandableListView.setOnChildClickListener(new ExpandableListView.OnChildClickListener() {

            @Override
            public boolean onChildClick(ExpandableListView parent, View v,
                                        int groupPosition, int childPosition, long id) {

                return false;
            }
        });
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(R.transition.slide_from_left, R.transition.slide_to_right);
    }
}
