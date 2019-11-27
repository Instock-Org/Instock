package com.example.instock;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;

public class EmployeeLoginActivity extends AppCompatActivity {

    //private ProgressBar spinner;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_employee_login);

        EditText usernameEditText = findViewById(R.id.employee_input_email);
        EditText passwordEditText = findViewById(R.id.employee_input_password);
        Button loginButton = findViewById(R.id.employee_login_button);
        //spinner = (ProgressBar)findViewById(R.id.employee_progressbar);
        //spinner.setVisibility(View.GONE);


        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               // spinner.setVisibility(View.VISIBLE);
              //  spinner.animate();

                //TODO: first check if username and password is autherized in the data base

                Intent intent = new Intent(EmployeeLoginActivity.this, EmployeeStock.class);
                startActivity(intent);
            }
        });
    }
}
