package com.example.instock;

public class EmployeeStock {

    private String productName;
    private String productCount;
    private String productId;
    private String storeId;

    public EmployeeStock(String productName, String productCount, String productId, String storeId) {
        this.productName = productName;
        this.productCount = productCount;
        this.productId = productId;
        this.storeId = storeId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductCount() {
        return productCount;
    }

    public void setProductCount(String productCount) {
        this.productCount = productCount;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getStoreId() {
        return toString();
    }

    public void setStoreId(String storeId) {
        this.storeId = storeId;
    }
}
