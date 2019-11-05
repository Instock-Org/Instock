package com.example.instock.db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class TaskDbHelper extends SQLiteOpenHelper {

    public TaskDbHelper(Context context) {
        super(context, TaskContractUtil.DB_NAME, null, TaskContractUtil.DB_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String createTable = "CREATE TABLE " + TaskContractUtil.TaskEntry.TABLE + " ( " +
                TaskContractUtil.TaskEntry._ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                TaskContractUtil.TaskEntry.COL_TASK_TITLE + " TEXT NOT NULL);";

        db.execSQL(createTable);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TaskContractUtil.TaskEntry.TABLE);
        onCreate(db);
    }
}