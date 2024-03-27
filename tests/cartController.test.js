const {
    getCart,
    createCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    calculateTotalPrice,
    deleteCart
} = require('../controllers/cartController');

const { Cart } = require('../models/cart');
const { Book } = require('../models/book');

jest.mock('../models/cart');
jest.mock('../models/book');

describe('Cart Controller', () => {

    describe('calculateTotalPrice', () => {
        it('should calculate total price correctly', async () => {
            const fakeCartId = 'fakeCartId';
            const fakeCart = {
                _id: fakeCartId,
                items: [
                    { book_id: 'fakeBookId1', quantity: 2 },
                    { book_id: 'fakeBookId2', quantity: 3 }
                ]
            };

            const fakeBook1 = { price: 10 };
            const fakeBook2 = { price: 20 };

            Cart.findById.mockResolvedValueOnce(fakeCart);
            Book.findById.mockImplementation(async (bookId) => {
                if (bookId === 'fakeBookId1') return fakeBook1;
                if (bookId === 'fakeBookId2') return fakeBook2;
            });

            const totalPrice = await calculateTotalPrice(fakeCartId);

            expect(totalPrice).toEqual(2 * 10 + 3 * 20); // 2 items of book1 and 3 items of book2
            expect(Cart.findById).toHaveBeenCalledWith(fakeCartId);
            expect(Book.findById).toHaveBeenCalledWith('fakeBookId1');
            expect(Book.findById).toHaveBeenCalledWith('fakeBookId2');
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});