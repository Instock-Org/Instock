package com.example.instock;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.CardView;
import android.view.View;

public class StartActivity extends AppCompatActivity {

private CardView customerLoginCardView;
private CardView employeeLoginCardView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start);

        customerLoginCardView = findViewById(R.id.start_login_user);
        customerLoginCardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Launch User activity
                Intent intent = new Intent(StartActivity.this, UserViewActivity.class);
                startActivity(intent);
            }
        });

        employeeLoginCardView = findViewById(R.id.start_login_employee);
        employeeLoginCardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Launch Employee activity

            }
        });
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(R.transition.slide_from_left, R.transition.slide_to_right);
    }
}
