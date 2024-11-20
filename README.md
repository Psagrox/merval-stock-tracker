# Merval Stock Tracker

**Merval Stock Tracker** is a web application built with Angular that allows users to manage a portfolio of Argentine stocks. Users can add stocks with detailed information about the purchase (symbol, purchase date, quantity, dollar value at the time of purchase) and track current gains or losses based on the current stock price and the MEP dollar rate.

## Features

- **Portfolio Management**: Add, edit, and delete stocks in the portfolio.
- **Real-Time Calculations**: Automatically calculate the current value of stocks and the percentage difference based on the purchase value.
- **Dollar Rate**: Fetch the current MEP dollar rate to calculate gains/losses.
- **CSV Import/Export**: Import and export the portfolio from/to CSV files.
- **User-Friendly Interface**: Clear visualization of data in an interactive table with the option to directly edit values.

## Technologies Used

- **Angular 17**: Framework for building the application.
- **Angular Material**: UI component library for a better user experience.
- **RxJS**: Library for handling asynchronous operations and reactive data flows.
- **TypeScript**: Programming language used for the application.
- **DoalrAPI**: Integration with an API to get the real-time MEP dollar rate.
- **Real-time-finance-data API**: Integration with an API to get up-to-date information on stocks.

## Usage

### Add a Stock

1. Go to the user interface and click on the "Add Stock" button.
2. Fill in the fields with the stock symbol, purchase date, quantity of stocks, and the dollar value at the time of purchase.
3. Click "Save" to add the stock to your portfolio.

### View Portfolio

The portfolio is displayed in an interactive table. Each row contains the stock information and allows you to see the current value, percentage difference, and value in pesos based on the current dollar rate.

### Import/Export CSV

You can import and export the portfolio data in CSV format from the options menu.

## Contributing

Contributions are welcome! If you have an improvement or fix, please open a pull request or an issue.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch for your contribution (`git checkout -b new-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to your branch (`git push origin new-feature`).
6. Open a pull request.

## License

This project is licensed under the MIT License. 

## Contact

If you have any questions or suggestions, feel free to contact the author:

- **Email**: waljaviergalvan@gmail.com
- **GitHub**: [Psagrox](https://github.com/Psagrox/)
