package com.example.instock;

import android.app.SearchManager;
import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.SearchView;

import java.util.ArrayList;
import java.util.List;

public class SearchActivity extends AppCompatActivity implements SearchView.OnQueryTextListener {

    private MenuItem menuItemSearch;
    private SearchView productSearchView;
    private ListView productListView;
    ArrayAdapter<String> productListAdapter;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        productListView = findViewById(R.id.product_list_view);

        // TODO: Replace this with the real list of products from server.
        List<String> productList = new ArrayList<String>();
        productList.add("Apple");
        productList.add("Banana");
        productList.add("Milk");
        productList.add("Eggs");
        productList.add("Bread");
        productList.add("Yogurt");

        // List adapter
        productListAdapter = new ArrayAdapter<String>(
                this,
                android.R.layout.simple_list_item_1,
                productList );

        productListView.setAdapter(productListAdapter);
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
