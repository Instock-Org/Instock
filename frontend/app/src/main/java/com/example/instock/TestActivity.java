package com.example.instock;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.android.gms.auth.api.signin.GoogleSignInAccount;

public class TestActivity extends AppCompatActivity {
    private final String TAG = "TestActivity";
    public static final String GOOGLE_ACCOUNT = "google_account";

    TextView emailInfoTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test);

        emailInfoTextView = (TextView) findViewById(R.id.email_info);

        GoogleSignInAccount googleSignInAccount = getIntent().getParcelableExtra(GOOGLE_ACCOUNT);
        emailInfoTextView.setText(googleSignInAccount.getEmail());

        Button backButton = (Button) findViewById(R.id.back_button);
        backButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // Code here executes on main thread after user presses button
                Log.d(TAG, "Clicked back button");
                Intent intent = new Intent(TestActivity.this, AuthenticationActivity.class);
                startActivity(intent);
                finish();
            }
        });
    }
}
