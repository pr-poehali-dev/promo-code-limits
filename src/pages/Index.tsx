import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
  items: CartItem[];
}

const products: Product[] = [
  {
    id: 1,
    name: 'Умные часы Premium',
    price: 24990,
    category: 'Электроника',
    image: 'https://cdn.poehali.dev/projects/6e89ad4b-f88d-4ca3-93fa-5835ff8cd19c/files/a9c0c7aa-067a-4592-9948-32581ba83897.jpg',
    description: 'Стильные умные часы с AMOLED-дисплеем'
  },
  {
    id: 2,
    name: 'Беспроводная колонка',
    price: 8990,
    category: 'Аудио',
    image: 'https://cdn.poehali.dev/projects/6e89ad4b-f88d-4ca3-93fa-5835ff8cd19c/files/5a86f7ec-a139-42b9-9672-fb3efc63e750.jpg',
    description: 'Мощный звук 360° с защитой от воды'
  },
  {
    id: 3,
    name: 'Наушники TWS Pro',
    price: 12990,
    category: 'Аудио',
    image: 'https://cdn.poehali.dev/projects/6e89ad4b-f88d-4ca3-93fa-5835ff8cd19c/files/a9c0c7aa-067a-4592-9948-32581ba83897.jpg',
    description: 'Активное шумоподавление и Hi-Res звук'
  },
  {
    id: 4,
    name: 'Фитнес-браслет',
    price: 4990,
    category: 'Электроника',
    image: 'https://cdn.poehali.dev/projects/6e89ad4b-f88d-4ca3-93fa-5835ff8cd19c/files/5a86f7ec-a139-42b9-9672-fb3efc63e750.jpg',
    description: 'Отслеживание активности 24/7'
  },
  {
    id: 5,
    name: 'Портативное зарядное',
    price: 3490,
    category: 'Аксессуары',
    image: 'https://cdn.poehali.dev/projects/6e89ad4b-f88d-4ca3-93fa-5835ff8cd19c/files/a9c0c7aa-067a-4592-9948-32581ba83897.jpg',
    description: 'Power Bank 20000 мАч с быстрой зарядкой'
  },
  {
    id: 6,
    name: 'Умная лампа RGB',
    price: 2990,
    category: 'Умный дом',
    image: 'https://cdn.poehali.dev/projects/6e89ad4b-f88d-4ca3-93fa-5835ff8cd19c/files/5a86f7ec-a139-42b9-9672-fb3efc63e750.jpg',
    description: '16 млн цветов, управление со смартфона'
  }
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders] = useState<Order[]>([
    {
      id: 1001,
      date: '15 октября 2024',
      total: 37980,
      status: 'Доставлен',
      items: [
        { ...products[0], quantity: 1 },
        { ...products[1], quantity: 1 }
      ]
    }
  ]);

  const categories = ['Все', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success('Товар добавлен в корзину');
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="ShoppingBag" className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TechStore
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-secondary">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg animate-slide-in-right">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                  <SheetDescription>
                    {cartCount} товар{cartCount === 1 ? '' : cartCount < 5 ? 'а' : 'ов'} на сумму {cartTotal.toLocaleString('ru-RU')} ₽
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Icon name="ShoppingCart" className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Корзина пуста</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                        {cart.map(item => (
                          <Card key={item.id} className="animate-fade-in">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="h-20 w-20 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">{item.price.toLocaleString('ru-RU')} ₽</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button 
                                      size="icon" 
                                      variant="outline" 
                                      className="h-7 w-7"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                      <Icon name="Minus" className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <Button 
                                      size="icon" 
                                      variant="outline" 
                                      className="h-7 w-7"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Icon name="Plus" className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-7 w-7 ml-auto text-destructive"
                                      onClick={() => removeFromCart(item.id)}
                                    >
                                      <Icon name="Trash2" className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-lg font-bold">
                          <span>Итого:</span>
                          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {cartTotal.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                        <Button className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90" size="lg">
                          <Icon name="CreditCard" className="mr-2 h-5 w-5" />
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Icon name="User" className="mr-2 h-4 w-4" />
                  Профиль
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg animate-slide-in-right">
                <SheetHeader>
                  <SheetTitle>Личный кабинет</SheetTitle>
                  <SheetDescription>Управление профилем и заказами</SheetDescription>
                </SheetHeader>
                
                <Tabs defaultValue="profile" className="mt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Профиль</TabsTrigger>
                    <TabsTrigger value="orders">Заказы</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя</Label>
                      <Input id="name" placeholder="Иван Петров" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="ivan@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input id="phone" type="tel" placeholder="+7 (999) 123-45-67" />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                      Сохранить изменения
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="orders" className="space-y-4 mt-4">
                    {orders.map(order => (
                      <Card key={order.id} className="animate-fade-in">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">Заказ #{order.id}</CardTitle>
                              <CardDescription>{order.date}</CardDescription>
                            </div>
                            <Badge variant={order.status === 'Доставлен' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {order.items.map(item => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.name} × {item.quantity}</span>
                                <span>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <span className="font-semibold">Итого:</span>
                          <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {order.total.toLocaleString('ru-RU')} ₽
                          </span>
                        </CardFooter>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <section className="mb-12 text-center animate-fade-in">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Премиум гаджеты
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Лучшие технологии для вашего комфорта
          </p>
        </section>

        <div className="flex gap-2 mb-8 flex-wrap justify-center animate-fade-in">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-gradient-to-r from-primary to-secondary' : ''}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge className="absolute top-4 right-4 bg-secondary">
                  {product.category}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center justify-between">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
                <Button 
                  onClick={() => addToCart(product)}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <Icon name="Plus" className="mr-2 h-4 w-4" />
                  В корзину
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container py-8 text-center text-muted-foreground">
          <p>© 2024 TechStore. Премиум гаджеты для вас</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
