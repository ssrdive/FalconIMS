import InventoryRoot from 'views/Inventory/InventoryRoot';
import AddModel from 'views/Inventory/Model/AddModel';
import AllModel from 'views/Inventory/Model/AllModel';
import EditModel from 'views/Inventory/Model/EditModel';
import AddWarehouse from 'views/Inventory/Warehouse/AddWarehouse';
import AllWarehouse from 'views/Inventory/Warehouse/AllWarehouse';
import EditWarehouse from 'views/Inventory/Warehouse/EditWarehouse';
import AddUser from 'views/Inventory/User/AddUser';
import AllUser from 'views/Inventory/User/AllUser';
import AddRegion from 'views/Inventory/Region/AddRegion';
import AllRegion from 'views/Inventory/Region/AllRegion';
import AddTerritory from 'views/Inventory/Territory/AddTerritory';
import AllTerritory from 'views/Inventory/Territory/AllTerritory';
import ItemSearch from 'views/Inventory/ItemSearch/ItemSearch';
import DocumentSearch from 'views/Inventory/DocumentSearch/DocumentSearch';
import GoodsIn from 'views/Inventory/InventoryTransactions/GoodsIn';
import GoodsOut from 'views/Inventory/InventoryTransactions/GoodsOut';
import GoodsTransfer from 'views/Inventory/InventoryTransactions/GoodsTransfer';
import GoodsReturn from 'views/Inventory/InventoryTransactions/GoodsReturn';
import AllDocuments from 'views/Inventory/AllDocuments/AllDocuments';
import Stock from 'views/Inventory/Stock/Stock';
import StockDetails from 'views/Inventory/StockDetails/StockDetails';

const basePath = '/app/inventory';

const inventoryRoutes = [
  {
    path: '/',
    title: 'Inventory Management',
    component: InventoryRoot,
    basePath
  },
  {
    path: '/model/add',
    title: 'Add Model',
    component: AddModel,
    basePath
  },
  {
    path: '/model/all',
    title: 'All Models',
    component: AllModel,
    basePath
  },
  {
    path: '/model/edit/:id',
    title: 'Edit Model',
    component: EditModel,
    basePath
  },
  {
    path: '/warehouse/add',
    title: 'Add Warehouse',
    component: AddWarehouse,
    basePath
  },
  {
    path: '/warehouse/all',
    title: 'All Warehouses',
    component: AllWarehouse,
    basePath
  },
  {
    path: '/warehouse/edit/:id',
    title: 'Edit Warehouse',
    component: EditWarehouse,
    basePath
  },
  {
    path: '/user/add',
    title: 'Add User',
    component: AddUser,
    basePath
  },
  {
    path: '/user/all',
    title: 'All Users',
    component: AllUser,
    basePath
  },
  {
    path: '/itemSearch',
    title: 'Item Search',
    component: ItemSearch,
    basePath
  },
  {
    path: '/documentSearch',
    title: 'Document Search',
    component: DocumentSearch,
    basePath
  },
  {
    path: '/goods-in',
    title: 'Goods In',
    component: GoodsIn,
    basePath
  },
  {
    path: '/goods-out',
    title: 'Goods Out',
    component: GoodsOut,
    basePath
  },
  {
    path: '/goods-transfer',
    title: 'Goods Transfer',
    component: GoodsTransfer,
    basePath
  },
  {
    path: '/goods-return',
    title: 'Goods Return',
    component: GoodsReturn,
    basePath
  },
  {
    path: '/all-documents',
    title: 'All Documents',
    component: AllDocuments,
    basePath
  },
  {
    path: '/stock',
    title: 'Stock',
    component: Stock,
    basePath
  },
  {
    path: '/stock-details',
    title: 'Stock Details',
    component: StockDetails,
    basePath
  },
  {
    path: '/region/add',
    title: 'Add Region',
    component: AddRegion,
    basePath
  },
  {
    path: '/region/all',
    title: 'All Regions',
    component: AllRegion,
    basePath
  },
  {
    path: '/territory/add',
    title: 'Add Territory',
    component: AddTerritory,
    basePath
  },
  {
    path: '/territory/all',
    title: 'All Territories',
    component: AllTerritory,
    basePath
  },
];

export default inventoryRoutes;