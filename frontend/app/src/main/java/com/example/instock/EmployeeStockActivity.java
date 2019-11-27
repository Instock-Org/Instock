package com.example.instock;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.view.WindowManager;

import java.util.ArrayList;

public class EmployeeStockActivity extends AppCompatActivity {

    static View.OnClickListener myOnClickListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_employee_stock);
        getSupportActionBar().setTitle("Update Stock");

        this.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);

        // TODO: replace with pulling the data from the backend
        ArrayList<EmployeeStock> employeeStockList = new ArrayList<>();
        employeeStockList.add(new EmployeeStock("Apple", "0"));
        employeeStockList.add(new EmployeeStock("Banana", "1"));
        employeeStockList.add(new EmployeeStock("Yogurt", "2"));
        employeeStockList.add(new EmployeeStock("Bread", "3"));
        employeeStockList.add(new EmployeeStock("Milk", "4"));
        employeeStockList.add(new EmployeeStock("Eggs", "5"));
        employeeStockList.add(new EmployeeStock("Pomegranate", "6"));
        employeeStockList.add(new EmployeeStock("Chocolate chip cookies", "7"));
        employeeStockList.add(new EmployeeStock("Birthday cake", "7"));
        employeeStockList.add(new EmployeeStock("Broccoli", "8"));
        employeeStockList.add(new EmployeeStock("Carrots", "9"));
        employeeStockList.add(new EmployeeStock("Cauliflower", "10"));
        employeeStockList.add(new EmployeeStock("Asparagus", "11"));
        employeeStockList.add(new EmployeeStock("Romaine lettuce", "12"));
        employeeStockList.add(new EmployeeStock("Bagels", "13"));
        employeeStockList.add(new EmployeeStock("Cream cheese", "14"));
        employeeStockList.add(new EmployeeStock("Hamburger buns", "15"));
        employeeStockList.add(new EmployeeStock("Hamburger patties", "16"));

        RecyclerView recyclerView = (RecyclerView) findViewById(R.id.employee_recycler_view);

        RecyclerView.Adapter adapter = new RecyclerViewAdapter(employeeStockList);

        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setItemAnimator(new DefaultItemAnimator());

        recyclerView.setAdapter(adapter);
    }
}
