package com.example.instock;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class EmployeeStockActivity extends AppCompatActivity {
    private String TAG = "EmployeeStockActivity";

    private static RecyclerView.Adapter adapter;
    private RecyclerView.LayoutManager layoutManager;
    private static RecyclerView recyclerView;
    static View.OnClickListener myOnClickListener;
    private ArrayList<EmployeeStock> employeeStockList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_employee_stock);

        Intent intent = getIntent();
        final String storeId = intent.getStringExtra("storeId");

        getSupportActionBar().setTitle("Update Stock");

        this.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);

        Retrofit retrofit = NetworkClient.getRetrofitClient();
        final InstockAPIs instockAPIs = retrofit.create(InstockAPIs.class);

        Call call = instockAPIs.getItemsForStore(storeId); // get request

        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
                Log.d(TAG, String.valueOf(response.code()));
                if (response.body() != null) {
                    List<StoreItem> res = (List<StoreItem>) response.body();
                    JsonArray itemIds = new JsonArray();
                    final List<String> quantities = new ArrayList<>();

                    // get item ids from store
                    for (StoreItem item : res) {
                        itemIds.add(item.getItemId());
                        quantities.add(String.valueOf(item.getQuantity()));
                    }

                    // call api to get items from item ids
                    JsonObject body = new JsonObject();
                    body.add("itemIds", itemIds);

                    Call call2 = instockAPIs.getMulitpleItems(body);

                    call2.enqueue(new Callback() {
                        @Override
                        public void onResponse(Call call, Response response) {
                            List<Item> res = (List<Item>) response.body();
                            employeeStockList = new ArrayList<>();

                            int i = 0;
                            for (Item item : res) {
                                employeeStockList.add(new EmployeeStock(item.getName(), quantities.get(i), item.getId(), storeId));
                                i += 1;
                            }

                            recyclerView = (RecyclerView) findViewById(R.id.employee_recycler_view);

                            adapter = new RecyclerViewAdapter(employeeStockList);

                            layoutManager = new LinearLayoutManager(EmployeeStockActivity.this);
                            recyclerView.setLayoutManager(layoutManager);
                            recyclerView.setItemAnimator(new DefaultItemAnimator());

                            recyclerView.setAdapter(adapter);
                        }

                        @Override
                        public void onFailure(Call call, Throwable t) {
                            // Error callback
                            Log.d(TAG, t.getMessage());
                            Log.d(TAG, "API request failed");
                        }
                    });
                }
            }
            @Override
            public void onFailure(Call call, Throwable t) {
                // Error callback
                Log.d(TAG, t.getMessage());
                Log.d(TAG, "API request failed");
            }
        });

//        employeeStockList = new ArrayList<>();
//        employeeStockList.add(new EmployeeStock("Apple", "0"));
//        employeeStockList.add(new EmployeeStock("Banana", "1"));
//        employeeStockList.add(new EmployeeStock("Yogurt", "2"));
//        employeeStockList.add(new EmployeeStock("Bread", "3"));
//        employeeStockList.add(new EmployeeStock("Milk", "4"));
//        employeeStockList.add(new EmployeeStock("Eggs", "5"));
//        employeeStockList.add(new EmployeeStock("Pomegranate", "6"));
//        employeeStockList.add(new EmployeeStock("Chocolate chip cookies", "7"));
//        employeeStockList.add(new EmployeeStock("Birthday cake", "7"));
//        employeeStockList.add(new EmployeeStock("Broccoli", "8"));
//        employeeStockList.add(new EmployeeStock("Carrots", "9"));
//        employeeStockList.add(new EmployeeStock("Cauliflower", "10"));
//        employeeStockList.add(new EmployeeStock("Asparagus", "11"));
//        employeeStockList.add(new EmployeeStock("Romaine lettuce", "12"));
//        employeeStockList.add(new EmployeeStock("Bagels", "13"));
//        employeeStockList.add(new EmployeeStock("Cream cheese", "14"));
//        employeeStockList.add(new EmployeeStock("Hamburger buns", "15"));
//        employeeStockList.add(new EmployeeStock("Hamburger patties", "16"));
//
//        recyclerView = (RecyclerView) findViewById(R.id.employee_recycler_view);
//
//        adapter = new RecyclerViewAdapter(employeeStockList);
//
//        layoutManager = new LinearLayoutManager(this);
//        recyclerView.setLayoutManager(layoutManager);
//        recyclerView.setItemAnimator(new DefaultItemAnimator());
//
//        recyclerView.setAdapter(adapter);
    }
}
