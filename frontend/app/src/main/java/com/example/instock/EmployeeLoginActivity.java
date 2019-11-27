package com.example.instock;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class EmployeeLoginActivity extends AppCompatActivity {
    private final String TAG = "EmployeeLoginActivity";
    //private ProgressBar spinner;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_employee_login);

        final EditText usernameEditText = findViewById(R.id.employee_input_email);
        final EditText passwordEditText = findViewById(R.id.employee_input_password);
        Button loginButton = findViewById(R.id.employee_login_button);
        //spinner = (ProgressBar)findViewById(R.id.employee_progressbar);
        //spinner.setVisibility(View.GONE);


        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               // spinner.setVisibility(View.VISIBLE);
              //  spinner.animate();

                //TODO: first check if username and password is autherized in the data base
                Retrofit retrofit = NetworkClient.getRetrofitClient();
                final InstockAPIs instockAPIs = retrofit.create(InstockAPIs.class);

                Call call = instockAPIs.loginEmployee(usernameEditText.getText().toString(), passwordEditText.getText().toString()); // get request

                call.enqueue(new Callback() {
                    @Override
                    public void onResponse(Call call, Response response) {
                        Log.d(TAG, String.valueOf(response.code()));
                        if (response.code() == 200) {
                            Intent intent = new Intent(EmployeeLoginActivity.this, EmployeeStockActivity.class);
                            startActivity(intent);
                        } else {
                            Toast.makeText(getApplicationContext(),"Incorrect username or password.",Toast.LENGTH_SHORT).show();
                        }
                    }
                    @Override
                    public void onFailure(Call call, Throwable t) {
                        // Error callback
                        Log.d(TAG, t.getMessage());
                        Log.d(TAG, "API request failed");
                    }
                });
            }
        });
    }
}
