package com.example.instock;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class ProductViewActivity extends AppCompatActivity {

    private TextView itemNameTextView;
    private TextView priceAmountTextView;
    private ArrayList<String> storesData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_product_view);

        Intent intent = getIntent();
        final String itemName = intent.getStringExtra("Item name");

        Retrofit retrofit = NetworkClient.getRetrofitClient();
        final InstockAPIs instockAPIs = retrofit.create(InstockAPIs.class);

        Call call = instockAPIs.getStoresForItem(itemName); // get request

        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
                Log.d("ProductViewActivity", String.valueOf(response.code()));
                if (response.body() != null) {
                    ItemStoreListResponse res = (ItemStoreListResponse) response.body();

                  //  final String itemId = res.getId();
                    final ArrayList<String> storeIds = new ArrayList<>();

                    ArrayList<String> storesList = new ArrayList<>();
                    ArrayList<String> stockList = new ArrayList<>();
                    ArrayList<String> priceList = new ArrayList<>();

                    for (ItemStore store : res.getStores()) {
                        storesList.add(store.getName());
                        stockList.add(String.valueOf(store.getQuantity()));
                        storeIds.add(store.getId());
                        priceList.add('$' + String.valueOf(store.getPrice()));
                    }

                    CustomListAdapter adapter = new CustomListAdapter(ProductViewActivity.this, storesList, stockList, priceList);

                    ListView storesListView = findViewById(R.id.availability_stores_list);
                    storesListView.setAdapter(adapter);

                    itemNameTextView = findViewById(R.id.item_name);
                    itemNameTextView.setText(itemName);
                   // priceAmountTextView = findViewById(R.id.price_amount);
//                    priceAmountTextView.setText();

                    Button notifyStockButton = findViewById(R.id.notify_stock_button);

                    notifyStockButton.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            // TODO: add user to list to be updated by push notification
                            JsonObject body = new JsonObject();
                            body.addProperty("storeId", storeIds.get(0));
                            body.addProperty("itemId", itemId);


                            Call call2 = instockAPIs.addSubscription(body);

                            call2.enqueue(new Callback() {
                                @Override
                                public void onResponse(Call call, Response response) {
                                    Log.d("ProductViewActivity", String.valueOf(response.code()));

                                }

                                @Override
                                public void onFailure(Call call, Throwable t) {
                                    // Error callback
                                    Log.d("ProductViewActivity", t.getMessage());
                                    Log.d("ProductViewActivity", "API request failed");
                                }
                            });
                        }
                    });
                }
            }
            @Override
            public void onFailure(Call call, Throwable t) {
                // Error callback
                Log.d("ProductViewActivity", t.getMessage());
                Log.d("ProductViewActivity", "API request failed");
            }
        });
    }
}
