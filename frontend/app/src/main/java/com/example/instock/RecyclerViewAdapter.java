package com.example.instock;

import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.ArrayList;

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
                    // TODO: Also add a call to update the database.
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
