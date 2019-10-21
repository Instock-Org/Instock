package com.example.instock;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.facebook.AccessToken;
import com.facebook.AccessTokenTracker;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;

import org.json.JSONException;
import org.json.JSONObject;

public class TestActivity extends AppCompatActivity {
    private final String TAG = "TestActivity";
    public static final String GOOGLE_ACCOUNT = "google_account";

//    AccessTokenTracker accessTokenTracker;
//    AccessToken accessToken;

    TextView emailInfoTextView;
    private Button backButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test);

        emailInfoTextView = (TextView) findViewById(R.id.email_info);

        GoogleSignInAccount googleSignInAccount = getIntent().getParcelableExtra(GOOGLE_ACCOUNT);
        emailInfoTextView.setText(googleSignInAccount.getEmail());

        backButton = (Button) findViewById(R.id.back_button);
        backButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // Code here executes on main thread after user presses button
                Intent intent = new Intent(TestActivity.this, AuthenticationActivity.class);
                startActivity(intent);
                finish();
            }
        });




//        fillUserInfo();
//        trackFBAccessToken();
    }

//    private void fillUserInfo() {
//        accessToken = AccessToken.getCurrentAccessToken();
//        if (accessToken == null) {
//            Log.d(TAG, "Couldn't display fb access token");
//
//        }
//        else {
//            GraphRequest graphRequest = GraphRequest.newMeRequest(accessToken, new GraphRequest.GraphJSONObjectCallback() {
//                @Override
//                public void onCompleted(JSONObject object, GraphResponse response) {
//                    Log.d("TAG", object.toString());
//                    displayUserInfo(object);
//                }
//            });
//
//            Bundle parameters = new Bundle();
//            parameters.putString("fields", "id,name,email");
//            graphRequest.setParameters(parameters);
//            graphRequest.executeAsync();
//        }
//    }
//
//    private void trackFBAccessToken() {
//        accessTokenTracker = new AccessTokenTracker() {
//            @Override
//            protected void onCurrentAccessTokenChanged(AccessToken oldAccessToken, AccessToken currentAccessToken) {
//                if (currentAccessToken == null) {
//                    Log.d(TAG, "Creating intent to go back to AuthenticationActivity");
//                    Intent intent = new Intent(TestActivity.this, AuthenticationActivity.class);
//                }
//            }
//        };
//        accessTokenTracker.startTracking();
//    }
//
//    private void displayUserInfo(JSONObject object) {
//        String email = "";
//        try {
//            email = object.getString("email");
//            Log.d(TAG, email);
//            emailInfoTextView.setText(email);
//        }
//        catch (JSONException e) {
//            e.printStackTrace();
//        }
//    }
}
