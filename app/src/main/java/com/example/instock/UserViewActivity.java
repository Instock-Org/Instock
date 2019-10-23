package com.example.instock;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.CardView;
import android.view.View;

public class UserViewActivity extends AppCompatActivity {

    private CardView searchItemCardView;
    private CardView listEntryCardView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        overridePendingTransition(R.transition.slide_from_right, R.transition.slide_to_left);
        setContentView(R.layout.activity_user_view);

        searchItemCardView = findViewById(R.id.user_look_up_card_view);
        searchItemCardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(UserViewActivity.this, SearchActivity.class);
                startActivity(intent);
            }
        });

        listEntryCardView = findViewById(R.id.user_list_card_view);
        listEntryCardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                    Intent intent = new Intent(UserViewActivity.this, ShoppingListActivity.class);
                    startActivity(intent);
            }
        });
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(R.transition.slide_from_left, R.transition.slide_to_right);
    }
}
