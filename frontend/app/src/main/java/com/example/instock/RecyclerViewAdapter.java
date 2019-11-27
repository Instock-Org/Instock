package com.example.instock;

import android.content.Intent;
import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.JsonObject;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class RecyclerViewAdapter extends RecyclerView.Adapter<RecyclerViewAdapter.RecyclerViewHolder> {

    private ArrayList<EmployeeStock> dataList;

    public RecyclerViewAdapter(ArrayList<EmployeeStock> dataList) {
        this.dataList = dataList;
    }

    public class RecyclerViewHolder extends RecyclerView.ViewHolder {

        protected TextView textViewProductName;
        protected TextView textViewCount;

        public RecyclerViewHolder(View itemView) {
            super(itemView);
            this.textViewProductName = itemView.findViewById(R.id.product_name_text);
            this.textViewCount = itemView.findViewById(R.id.count_number);

            this.textViewCount.addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                    // No op
                }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {
                    dataList.get(getAdapterPosition()).setProductCount(textViewCount.getText().toString()); // Updates the UI to display the new number.
                    Retrofit retrofit = NetworkClient.getRetrofitClient();
                    final InstockAPIs instockAPIs = retrofit.create(InstockAPIs.class);
                    JsonObject body = new JsonObject();
                    body.addProperty("quantity",  dataList.get(getAdapterPosition()).getProductCount());

                    Call call = instockAPIs.updateItem(dataList.get(getAdapterPosition()).getStoreId(), dataList.get(getAdapterPosition()).getProductId(), body); // get request
                    call.enqueue(new Callback() {
                        @Override
                        public void onResponse(Call call, Response response) {
                            if (response.code() == 200) {

                            }
                        }

                        @Override
                        public void onFailure(Call call, Throwable t) {

                        }
                    });
                }

                @Override
                public void afterTextChanged(Editable s) {
                    // No op
                }
            });
        }
    }

    @Override
    public RecyclerViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.card_view_employee_stock, parent, false);

        view.setOnClickListener(EmployeeStockActivity.myOnClickListener);

        RecyclerViewHolder recyclerViewHolder = new RecyclerViewHolder(view);
        return recyclerViewHolder;
    }

    @Override
    public void onBindViewHolder(final RecyclerViewHolder holder, final int listPosition) {

        TextView textViewProductName = holder.textViewProductName;
        TextView textViewCount = holder.textViewCount;

        textViewProductName.setText(dataList.get(listPosition).getProductName());
        textViewCount.setText(dataList.get(listPosition).getProductCount());
    }

    @Override
    public int getItemCount() {
        return dataList.size();
    }
}
