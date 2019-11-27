package com.example.instock;

import com.google.gson.JsonObject;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface InstockAPIs {
    /*
    Get request to fetch items that match a search term (exact match)
    */
    @GET("/api/items")
    Call<List<ItemResponse>> getItem(@Query("search_term") String term);

    /*
    Post request to add a new item to the database
    */
    @Headers("Content-Type: application/json")
    @POST("/api/items")
    Call<String> addItem(@Body JsonObject body);

    /*
    Post request to send shopping list to the backend
    */
    @Headers("Content-Type: application/json")
    @POST("/api/stores/feweststores")
    Call<FewestStoresResponse> sendShoppingList(@Body JsonObject body);

    /*
    Get request to fetch all items in the db
    */
    @GET("/api/items/all")
    Call<List<String>> getAllItems();

    /*
    Get request to fetch all stores that carry an item
    */
    @GET("api/stores/item")
    Call<ItemStoreListResponse> getStoresForItem(@Query("search_term") String term);

    /*
    Post request to send google account id token to backend for auth
     */
    @Headers("Content-Type: application/json")
    @POST("api/users/createUser")
    Call<Void> googleAuth(@Body JsonObject body);

    /*
    Post request to get waypoint order for shortest path
    */
    @Headers("Content-Type: application/json")
    @POST("api/stores/shortestPath")
    Call<List<String>> getShortestPath(@Body JsonObject body);

    /*
    Post request to subscribe to an item in a store
     */
    @Headers("Content-Type: application/json")
    @POST("api/users/subscriptions")
    Call<Void> addSubscription(@Body JsonObject body);

    /*
    Get request to log in employee user
     */
    @Headers({"Accept:text/plain"})
    @GET("api/employees/login")
    Call<String> loginEmployee(@Query("email") String email, @Query("password") String password);

    /*
    Get request to get all items for a store
     */
    @GET("api/items/store/{id}")
    Call<List<StoreItem>> getItemsForStore(@Path("id") String id);

    /*
    Post request to get item objects via ids
     */
    @Headers("Content-Type: application/json")
    @POST("api/items/multiple")
    Call<List<Item>> getMultipleItems(@Body JsonObject body);

    /*
    Put request to update product count in store
    */
    @Headers("Content-Type: application/json")
    @PUT("api/items/store/{storeId}/{itemId}")
    Call<Void> updateItem(@Path("storeId") String storeId, @Path("itemId") String itemId, @Body JsonObject body);

    /*
    Post request to send notifications
     */
    @Headers("Content-Type: application/json")
    @PUT("api/items/restockNotifs/{storeId}/{itemId}")
    Call<Void> sendNotification(@Path("storeId") String storeId, @Path("itemId") String itemId);

}
