def quick_sort():
    arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    quick_sort_recursive(arr, 0, len(arr) - 1)
    print(arr)


def quick_sort_recursive(arr, left, right):
    if left < right:
        pivot = partition(arr, left, right)
        quick_sort_recursive(arr, left, pivot - 1)
        quick_sort_recursive(arr, pivot + 1, right)


def partition(arr, left, right):
    pivot = arr[right]
    i = left
    for j in range(left, right):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[right] = arr[right], arr[i]
    return i


if __name__ == "__main__":
    quick_sort()
