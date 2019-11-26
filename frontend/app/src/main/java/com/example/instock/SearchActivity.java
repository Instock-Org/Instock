package com.example.instock;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.SearchView;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class SearchActivity extends AppCompatActivity implements SearchView.OnQueryTextListener {
    private final String TAG = "SearchActivity";

    private MenuItem menuItemSearch;
    private SearchView productSearchView;
    private ListView productListView;
    ArrayAdapter<String> productListAdapter;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        productListView = findViewById(R.id.product_list_view);

        Retrofit retrofit = NetworkClient.getRetrofitClient();
        final InstockAPIs instockAPIs = retrofit.create(InstockAPIs.class);

        Call call = instockAPIs.getAllItems(); // get request

        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
                Log.d(TAG, String.valueOf(response.code()));
                if (response.body() != null) {
                    List<String> res = (List<String>) response.body();
                    List<String> productList = new ArrayList<String>(res);

                    // List adapter
                    productListAdapter = new ArrayAdapter<String>(
                            SearchActivity.this,
                            android.R.layout.simple_list_item_1,
                            productList );

                    productListView.setAdapter(productListAdapter);

                    productListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {

                        @Override
                        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                            String item = productListAdapter.getItem(position);

                            Intent intent = new Intent(SearchActivity.this, ProductViewActivity.class);
                            intent.putExtra("Item name", item);
                            startActivity(intent);
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

//        productList.add("Apple");
//        productList.add("Banana");
//        productList.add("Milk");
//        productList.add("Eggs");
//        productList.add("Bread");
//        productList.add("Yogurt");

        // List adapter
//        productListAdapter = new ArrayAdapter<String>(
//                this,
//                android.R.layout.simple_list_item_1,
//                productList );
//
//        productListView.setAdapter(productListAdapter);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.search_menu, menu);

        SearchManager searchManager = (SearchManager)
                getSystemService(Context.SEARCH_SERVICE);
        menuItemSearch = menu.findItem(R.id.search);
        productSearchView = (SearchView) menuItemSearch.getActionView();

        productSearchView.setSearchableInfo(searchManager.
                getSearchableInfo(getComponentName()));
        productSearchView.setSubmitButtonEnabled(true);
        productSearchView.setOnQueryTextListener(this);

        return true;
    }

    @Override
    public boolean onQueryTextSubmit(String query) {
        return false;
    }

    @Override
    public boolean onQueryTextChange(String newText) {
        // Filter products as user types an item.
        productListAdapter.getFilter().filter(newText);

        return true;
    }
}
