
// Service to manage supplier data in localStorage

const STORAGE_KEYS = {
    SUPPLIERS: 'suppliers_data',
    PRODUCTS: 'supplier_products',
    CURRENT_SESSION: 'supplier_session'
};

export const supplierService = {
    // Authentication
    registerSupplier: (supplierData) => {
        const suppliers = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPPLIERS) || '[]');

        // Check if exists
        if (suppliers.find(s => s.email === supplierData.email || s.mobile === supplierData.mobile)) {
            throw new Error('Supplier already registered with this email or mobile');
        }

        const newSupplier = {
            id: `SUP_${Date.now()}`,
            ...supplierData,
            joinedDate: new Date().toISOString(),
            status: 'active'
        };

        suppliers.push(newSupplier);
        localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
        return newSupplier;
    },

    loginSupplier: (identifier) => {
        const suppliers = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPPLIERS) || '[]');
        const supplier = suppliers.find(s => s.email === identifier || s.mobile === identifier);

        if (!supplier) {
            // For demo purposes, we might want to auto-register or just throw error
            // Let's allow test login for now by "mocking" a login if it's the demo phone
            if (identifier === '9876543210') {
                return {
                    id: 'SUP_DEMO',
                    businessName: 'Demo Supplier Enterprises',
                    name: 'Demo User',
                    mobile: '9876543210',
                    email: 'demo@supplier.com',
                    role: 'supplier'
                };
            }
            throw new Error('Supplier not found');
        }
        return supplier;
    },

    getSupplierById: (id) => {
        const suppliers = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPPLIERS) || '[]');
        const supplier = suppliers.find(s => s.id === id);

        // Demo fallback
        if (!supplier && id === 'SUP_DEMO') {
            return {
                id: 'SUP_DEMO',
                businessName: 'Demo Supplier Enterprises',
                name: 'Demo User',
                mobile: '9876543210',
                email: 'demo@supplier.com',
                role: 'supplier',
                joinedDate: new Date().toISOString()
            };
        }
        return supplier;
    },

    createSession: (supplier) => {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(supplier));
    },

    getCurrentSupplier: () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION));
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    },

    // Product Management
    getAllProducts: () => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    },

    getProducts: (supplierId) => {
        const allProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
        return allProducts.filter(p => p.supplierId === supplierId);
    },

    addProduct: (productData) => {
        const allProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
        const newProduct = {
            id: `PROD_${Date.now()}`,
            ...productData,
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        allProducts.push(newProduct);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(allProducts));
        return newProduct;
    },

    updateProduct: (productId, updates) => {
        const allProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
        const index = allProducts.findIndex(p => p.id === productId);

        if (index !== -1) {
            allProducts[index] = { ...allProducts[index], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(allProducts));
            return allProducts[index];
        }
        throw new Error('Product not found');
    },

    deleteProduct: (productId) => {
        let allProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
        allProducts = allProducts.filter(p => p.id !== productId);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(allProducts));
    },

    // Utilities
    convertImageToBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
};
