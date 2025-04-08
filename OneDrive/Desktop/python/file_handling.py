def read_and_modify_file(input_filename, output_filename):
    try:
        with open(input_filename, 'r') as infile:
            lines = infile.readlines()
            
        # Modify content (example: make all text uppercase)
        modified_lines = [line.upper() for line in lines]

        with open(output_filename, 'w') as outfile:
            outfile.writelines(modified_lines)

        print(f"✅ File '{input_filename}' read and written to '{output_filename}' successfully!")

    except FileNotFoundError:
        print(f"❌ Error: The file '{input_filename}' does not exist.")
    except IOError:
        print(f"❌ Error: Could not read/write file '{input_filename}' or '{output_filename}'.")

def main():
    input_file = input("📂 Enter the name of the file to read from: ")
    output_file = input("💾 Enter the name of the file to write to: ")
    read_and_modify_file(input_file, output_file)

if __name__ == "__main__":
    main()
