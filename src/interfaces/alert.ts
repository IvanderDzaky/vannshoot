export interface ApiAlert {
  title: string;
  description: string;
  variant: 'public' | 'admin';
}

export interface ApiListAlert {
  entityName: string;
  entityIdName: string;
}
