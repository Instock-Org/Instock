package com.example.instock;

import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.CardView;
import android.util.Log;
import android.view.View;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

public class StartActivity extends AppCompatActivity {
    private final String TAG = "StartActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start);

        initPushNotifications();

        CardView customerLoginCardView = findViewById(R.id.start_login_user);
        customerLoginCardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Launch User activity
            //    Intent intent = new Intent(StartActivity.this, UserViewActivity.class);
                Intent intent = new Intent(StartActivity.this, AuthenticationActivity.class);
                startActivity(intent);
            }
        });

        CardView employeeLoginCardView = findViewById(R.id.start_login_employee);
        employeeLoginCardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Launch Employee activity
                Intent intent = new Intent(StartActivity.this, EmployeeStockActivity.class);
                startActivity(intent);

            }
        });
    }

    private void initPushNotifications() {
        FirebaseInstanceId.getInstance().getInstanceId()
                .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
                    @Override
                    public void onComplete(@NonNull Task<InstanceIdResult> task) {
                        if (!task.isSuccessful()) {
                            Log.w(TAG, "getInstanceId failed", task.getException());
                            return;
                        }

                        // Get new Instance ID token
                        String token = task.getResult().getToken();
                        Log.d(TAG, token);
                    }
                });
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(R.transition.slide_from_left, R.transition.slide_to_right);
    }
}
