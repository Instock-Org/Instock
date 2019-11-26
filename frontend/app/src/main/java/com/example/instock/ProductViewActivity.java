package com.example.instock;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;

public class ProductViewActivity extends AppCompatActivity {

    private TextView itemNameTextView;
    private TextView priceAmountTextView;
    private ArrayList<String> storesData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_product_view);

        Intent intent = getIntent();
        String storeNameString = intent.getStringExtra("Item name");

        // TODO: replace with real data

        ArrayList<String> storesList = new ArrayList<>();
        storesList.add("Save On");
        storesList.add("Safeway");
        storesList.add("Whole Foods");
        storesList.add("Costco");

        ArrayList<String> stockList = new ArrayList<>();
        stockList.add("0");
        stockList.add("1");
        stockList.add("2");
        stockList.add("3");

        CustomListAdapter adapter = new CustomListAdapter(this, storesList, stockList);

        ListView storesListView = findViewById(R.id.availability_stores_list);
        storesListView.setAdapter(adapter);

        itemNameTextView = findViewById(R.id.item_name);
        itemNameTextView.setText(storeNameString);
        priceAmountTextView = findViewById(R.id.price_amount);

        // TODO: set real price amount

        Button notifyStockButton = findViewById(R.id.notify_stock_button);

        notifyStockButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // TODO: add user to list to be updated by push notification
            }
        });
    }
}
