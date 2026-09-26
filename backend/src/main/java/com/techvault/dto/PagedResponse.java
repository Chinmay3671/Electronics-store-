package com.techvault.dto;

import java.util.List;

public class PagedResponse<T> {

    private boolean success = true;
    private List<T> data;
    private Pagination pagination;

    public static class Pagination {
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
        private boolean last;

        public Pagination() {}

        public Pagination(int page, int size, long totalElements, int totalPages, boolean last) {
            this.page = page;
            this.size = size;
            this.totalElements = totalElements;
            this.totalPages = totalPages;
            this.last = last;
        }

        public int getPage() { return page; }
        public void setPage(int page) { this.page = page; }

        public int getSize() { return size; }
        public void setSize(int size) { this.size = size; }

        public long getTotalElements() { return totalElements; }
        public void setTotalElements(long totalElements) { this.totalElements = totalElements; }

        public int getTotalPages() { return totalPages; }
        public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

        public boolean isLast() { return last; }
        public void setLast(boolean last) { this.last = last; }
    }

    public PagedResponse() {}

    public PagedResponse(List<T> data, int page, int size, long totalElements, int totalPages, boolean last) {
        this.success = true;
        this.data = data;
        this.pagination = new Pagination(page, size, totalElements, totalPages, last);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public List<T> getData() { return data; }
    public void setData(List<T> data) { this.data = data; }

    public Pagination getPagination() { return pagination; }
    public void setPagination(Pagination pagination) { this.pagination = pagination; }
}
