package com.example.instock;

import android.content.ContentValues;
import android.content.DialogInterface;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Color;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import com.example.instock.db.TaskContract;
import com.example.instock.db.TaskDbHelper;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.ArrayList;

public class ShoppingListActivity extends AppCompatActivity {

    private TaskDbHelper mHelper;
    private ListView mTaskListView;
    private ArrayAdapter<String> mAdapter;
    private Button sendListButton;
    private ArrayList<String> taskList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        overridePendingTransition(R.transition.slide_from_right, R.transition.slide_to_left);
        setContentView(R.layout.activity_shopping_list);

        mHelper = new TaskDbHelper(this);
        mTaskListView = (ListView) findViewById(R.id.list_items);

        sendListButton = findViewById(R.id.list_send_button);
        sendListButton.setClickable(false);

        updateUI();

        sendListButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendList();
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_add_item:
                final EditText taskEditText = new EditText(this);
                AlertDialog dialog = new AlertDialog.Builder(this)
                        .setTitle("Add a new item")
                        .setView(taskEditText)
                        .setPositiveButton("Add", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                String task = String.valueOf(taskEditText.getText());
                                SQLiteDatabase db = mHelper.getWritableDatabase();
                                ContentValues values = new ContentValues();
                                values.put(TaskContract.TaskEntry.COL_TASK_TITLE, task);
                                db.insertWithOnConflict(TaskContract.TaskEntry.TABLE,
                                        null,
                                        values,
                                        SQLiteDatabase.CONFLICT_REPLACE);
                                db.close();
                                updateUI();
                            }
                        })
                        .setNegativeButton("Cancel", null)
                        .create();
                dialog.show();
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    private void updateUI() {
        taskList = new ArrayList<>();

        SQLiteDatabase db = mHelper.getReadableDatabase();
        Cursor cursor = db.query(TaskContract.TaskEntry.TABLE,
                new String[]{TaskContract.TaskEntry._ID, TaskContract.TaskEntry.COL_TASK_TITLE},
                null, null, null, null, null);
        while (cursor.moveToNext()) {
            int idx = cursor.getColumnIndex(TaskContract.TaskEntry.COL_TASK_TITLE);
            taskList.add(cursor.getString(idx));
        }

        if (mAdapter == null) {
            mAdapter = new ArrayAdapter<>(this,
                    R.layout.item_shopping,
                    R.id.item_title,
                    taskList);
            mTaskListView.setAdapter(mAdapter);
        } else {
            mAdapter.clear();
            mAdapter.addAll(taskList);
            mAdapter.notifyDataSetChanged();
        }

        cursor.close();
        db.close();

        if (taskList.isEmpty()) {
            disableButton();
        }

        if (!taskList.isEmpty()) {
            enableButton();
        }
    }

    public void sendList() {
        disableButton();

        // Add items to a json array and then create a json object for this.
        JsonArray jsonarray = new JsonArray();
        for (String item : this.taskList) {
            jsonarray.add(item);
        }
        JsonObject shoppingList = new JsonObject();
        shoppingList.add("shoppingList", jsonarray);

        // Include coordinates of users current location.
        // Uncomment and fix later when using real location.
//        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
//        Location location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
//        double longitude = location.getLongitude();
//        double latitude = location.getLatitude();

        double longitude = -123.249411;
        double latitude = 49.261773;
        shoppingList.addProperty("longitude", longitude);
        shoppingList.addProperty("latitude", latitude);

        // TODO: Send the shoppinglist Json as a post request to the server.
    }

    public void deleteTask(View view) {
        View parent = (View) view.getParent();
        TextView taskTextView = (TextView) parent.findViewById(R.id.item_title);
        String task = String.valueOf(taskTextView.getText());
        SQLiteDatabase db = mHelper.getWritableDatabase();
        db.delete(TaskContract.TaskEntry.TABLE,
                TaskContract.TaskEntry.COL_TASK_TITLE + " = ?",
                new String[]{task});
        db.close();
        updateUI();
    }

    private void disableButton() {
        sendListButton.setClickable(false);
        sendListButton.setBackgroundColor(Color.GRAY);
    }

    private void enableButton() {
        sendListButton.setClickable(true);
        sendListButton.setBackgroundColor(getResources().getColor(R.color.seaGreen));
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(R.transition.slide_from_left, R.transition.slide_to_right);
    }
}
