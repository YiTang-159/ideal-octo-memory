// Thêm đoạn code này vào file HTML trước thẻ </body>
function initializeSampleProducts() {
    // Kiểm tra xem đã có dữ liệu chưa hoặc dữ liệu bị thiếu trường 'status'
    let storedData = localStorage.getItem('morico_products');
    let needsInit = false;

    if (!storedData) {
        needsInit = true;
    } else {
        try {
            let parsed = JSON.parse(storedData);
            if (parsed.length > 0 && parsed[0].status === undefined) {
                needsInit = true; // Dữ liệu cũ bị thiếu các trường mới như status, cost...
            }
        } catch (e) {
            needsInit = true; // Lỗi parse
        }
    }

    if (needsInit) {
        console.log('🚀 Khởi tạo dữ liệu sản phẩm mẫu lần đầu hoặc cập nhật dữ liệu cũ...');
        const sampleProducts = [
            {
                id: 1,
                code: "SP001",
                name: "Bánh Trung Thu Golden Plum",
                price: 189000,
                cost: 120000,
                thumbnail: "../assets/image/product/banh-trung-thu-golden-plum.png",
                category: "ngot",
                stock: 25,
                stockStatus: "in-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh nướng – nhân ngọt",
                    "Trọng lượng": "150g",
                    "Thành phần": "Mận vàng cao cấp, bột mì, bơ, trứng gà, đường...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `
                <p>Tinh tế và mới mẻ, <strong>bánh Trung Thu Golden Plum</strong> là sự kết hợp hài hòa giữa vị ngọt của mận vàng và lớp vỏ bánh nướng thơm mềm. Lớp vỏ bánh vàng óng, mềm mịn ôm trọn phần nhân mận dẻo thơm, mang đến trải nghiệm vị giác quen mà lạ.</p>
                `,
                related_product_ids: [3, 4, 6, 8]
            },
            {
                id: 2,
                code: "SP002",
                name: "Bánh Trung Thu Hotate XO Mixed Nuts",
                price: 139000,
                cost: 90000,
                thumbnail: "../assets/image/product/banh-trung-thu-hotate-xo-mixed-nuts.png",
                category: "man",
                stock: 12,
                stockStatus: "low-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh nướng – nhân mặn",
                    "Trọng lượng": "150g",
                    "Thành phần": "Sò điệp XO, các loại hạt (hạt điều, hạt dưa...), lạp xưởng...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `
                <p>Một sự phá cách độc đáo cho mùa Trung Thu, <strong>bánh Hotate XO Mixed Nuts</strong> kết hợp vị mặn đậm đà của sốt sò điệp XO cay nhẹ cùng sự bùi béo của các loại hạt dinh dưỡng. Đây là lựa chọn hoàn hảo cho những ai tìm kiếm hương vị mới lạ.</p>
                `,
                related_product_ids: [5, 3, 7]
            },
            {
                id: 3,
                code: "SP003",
                name: "Bánh Trung Thu Matcha",
                price: 99000,
                cost: 65000,
                thumbnail: "../assets/image/product/banh-trung-thu-matcha.png",
                category: "ngot",
                stock: 40,
                stockStatus: "in-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh nướng – nhân trà xanh",
                    "Trọng lượng": "150g",
                    "Thành phần": "Bột matcha, bột mì, trứng, bơ, đậu xanh, đường...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `
                <p><strong>Bánh Trung Thu Matcha</strong> mang đậm hương vị thanh mát của trà xanh Nhật Bản. Hương thơm nhẹ, vị ngọt dịu, cùng lớp nhân đậu xanh hòa quyện matcha tinh tế, tạo nên cảm giác nhẹ nhàng và thư giãn.</p>
                `,
                related_product_ids: [1, 4, 6]
            },
            {
                id: 4,
                code: "SP004",
                name: "Bánh Trung Thu Murasaki Imo",
                price: 115000,
                cost: 75000,
                thumbnail: "../assets/image/product/banh-trung-thu-murasaki-imo.png",
                category: "ngot",
                stock: 30,
                stockStatus: "in-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh nướng – nhân ngọt",
                    "Trọng lượng": "150g",
                    "Thành phần": "Khoai lang tím Nhật, bột mì, đường, trứng, bơ...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `
                <p><strong>Bánh Trung Thu Murasaki Imo</strong> mang sắc tím dịu dàng của khoai lang Nhật Bản. Nhân khoai dẻo mịn, thơm nhẹ vị ngọt tự nhiên, hòa quyện cùng lớp vỏ bánh mềm vàng hấp dẫn.</p>
                `,
                related_product_ids: [1, 7]
            },
            {
                id: 5,
                code: "SP005",
                name: "Bánh Trung Thu Mushroom Mixed Nuts",
                price: 129000,
                cost: 85000,
                thumbnail: "../assets/image/product/banh-trung-thu-mushroom-mixed-nuts.png",
                category: "chay",
                stock: 18,
                stockStatus: "low-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh chay – nhân mặn nhẹ",
                    "Trọng lượng": "150g",
                    "Thành phần": "Nấm hương, hạt điều, hạt sen, đậu xanh, bột mì...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `
                <p><strong>Bánh Trung Thu Mushroom Mixed Nuts</strong> là lựa chọn thanh đạm và dinh dưỡng cho người ăn chay. Hương thơm của nấm hòa quyện cùng vị bùi béo của các loại hạt, tạo nên hương vị tự nhiên, nhẹ nhàng.</p>
                `,
                related_product_ids: [1, 2, 8]
            },
            {
                id: 6,
                code: "SP006",
                name: "Bánh Trung Thu Hạt Sen Dừa Non",
                price: 105000,
                cost: 70000,
                thumbnail: "../assets/image/product/banh-trung-thu-pink-nocturne.png",
                category: "ngot",
                stock: 50,
                stockStatus: "in-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh nướng – nhân ngọt",
                    "Trọng lượng": "150g",
                    "Thành phần": "Hạt sen, dừa non, bột mì, trứng, bơ, đường...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `
                <p><strong>Bánh Trung Thu Hạt Sen Dừa Non</strong> mang vị ngọt thanh, bùi béo của hạt sen hòa cùng mùi thơm nhẹ của dừa non, tạo cảm giác mềm mịn dễ chịu.</p>
                `,
                related_product_ids: [1, 3, 8]
            },
            {
                id: 7,
                code: "SP007",
                name: "Bánh Trung Thu Đậu Đỏ Trứng Muối",
                price: 125000,
                cost: 80000,
                thumbnail: "../assets/image/product/banh-trung-thu-takesumi-orange.png",
                category: "man",
                stock: 0,
                stockStatus: "out-of-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh nướng – nhân mặn",
                    "Trọng lượng": "150g",
                    "Thành phần": "Đậu đỏ, trứng muối, bột mì, đường, dầu thực vật...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `
                <p><strong>Bánh Trung Thu Đậu Đỏ Trứng Muối</strong> có vị mặn ngọt hài hòa, nhân đậu đỏ bùi quyện cùng trứng muối tan chảy, mang lại cảm giác trọn vị truyền thống và hiện đại.</p>
                `,
                related_product_ids: [4, 6, 8]
            },
            {
                id: 8,
                code: "SP008",
                name: "Bánh Trung Thu Xôi Gấc",
                price: 95000,
                cost: 65000,
                thumbnail: "../assets/image/product/banh-trung-thu-xoi-gac.png",
                category: "ngot",
                stock: 35,
                stockStatus: "in-stock",
                status: "active",
                details: {
                    "Thương hiệu": "Mor'dan Bakery",
                    "Loại bánh": "Bánh dẻo – nhân ngọt",
                    "Trọng lượng": "150g",
                    "Thành phần": "Gạo nếp, gấc tươi, nhân đậu xanh, dừa nạo...",
                    "Hạn sử dụng": "Xem trên bao bì sản phẩm"
                },
                description: `
                <p><strong>Bánh Trung Thu Xôi Gấc</strong> có màu đỏ tự nhiên từ gấc, tượng trưng cho may mắn và hạnh phúc. Hương thơm của nếp quyện cùng vị ngọt nhẹ của đậu xanh và dừa, mang đến cảm giác truyền thống thân quen.</p>
                `,
                related_product_ids: [1, 2, 5]
            }
        ];

        localStorage.setItem('morico_products', JSON.stringify(sampleProducts));
        console.log('✅ Đã khởi tạo ' + sampleProducts.length + ' sản phẩm mẫu');
        return sampleProducts;
    }
    return JSON.parse(localStorage.getItem('morico_products'));
}

// Gọi hàm này khi trang được tải
initializeSampleProducts();
