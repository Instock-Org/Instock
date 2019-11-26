package com.example.instock;

import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;

public class CustomListAdapter extends ArrayAdapter {

    private final Activity context;
    private final ArrayList<String> storesList;
    private final ArrayList<String> stockList;
    private final ArrayList<String> priceList;

    public CustomListAdapter(Activity context, ArrayList storeArrayParam, ArrayList stockArrayParam, ArrayList priceArrayParam){
        super(context,R.layout.product_view_store, storeArrayParam);

        this.context = context;
        this.storesList = storeArrayParam;
        this.stockList = stockArrayParam;
        this.priceList = priceArrayParam;
    }

    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater=context.getLayoutInflater();
        View rowView=inflater.inflate(R.layout.product_view_store, null,true);

        TextView storeNameTextView = (TextView) rowView.findViewById(R.id.grocery_store_name);
        TextView stockCountTextView = (TextView) rowView.findViewById(R.id.count_number);
        TextView pricetTextView = (TextView) rowView.findViewById(R.id.product_price);

        storeNameTextView.setText(storesList.get(position));
        stockCountTextView.setText(stockList.get(position));
        pricetTextView.setText(priceList.get(position));

        return rowView;
    };
}
