def DecimalToBinary(x):
    BinaryNumb = ""
    while x>0:
        if x%2 == 0:
            BinaryNumb = "0 "+BinaryNumb
        else:
            BinaryNumb = "1 "+BinaryNumb
        x//=2
    return BinaryNumb

def main():
    x = int(input("Enter Decimal Number: "))
    BinaryNumb = DecimalToBinary(x)
    print("Binary Number: ",BinaryNumb)
main()
