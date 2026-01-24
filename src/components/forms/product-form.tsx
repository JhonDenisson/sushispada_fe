"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAdminCategories } from "@/lib/hooks/admin/use-admin-categories";
import { type CreateProductInput, createProductSchema, type Product } from "@/lib/schemas/product";
import { cn } from "@/lib/utils/cn";

interface ProductFormProps {
    defaultValues?: Partial<Product>;
    onSubmit: (data: CreateProductInput) => void;
    isSubmitting?: boolean;
    className?: string;
}

export function ProductForm({
    defaultValues,
    onSubmit,
    isSubmitting,
    className,
}: ProductFormProps) {
    const { data: categories, isLoading: categoriesLoading } = useAdminCategories();

    const form = useForm<CreateProductInput>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: defaultValues?.name ?? "",
            description: defaultValues?.description ?? "",
            price_cents: defaultValues?.price_cents ?? 0,
            category_id: defaultValues?.category_id ?? 0,
            image_url: defaultValues?.image_url ?? "",
        },
    });

    const handleSubmit = form.handleSubmit((data) => {
        onSubmit(data);
    });

    // Format cents to display value (e.g., 1000 -> 10.00)
    const formatCentsToDisplay = (cents: number) => {
        return (cents / 100).toFixed(2);
    };

    // Parse display value to cents (e.g., 10.00 -> 1000)
    const parseDisplayToCents = (value: string) => {
        const num = parseFloat(value.replace(",", "."));
        return isNaN(num) ? 0 : Math.round(num * 100);
    };

    return (
        <form onSubmit={handleSubmit} className={cn("flex flex-col gap-4", className)}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="name">Nome *</FieldLabel>
                    <Input
                        id="name"
                        placeholder="Nome do produto"
                        {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                        <FieldError>{form.formState.errors.name.message}</FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="description">Descrição</FieldLabel>
                    <Textarea
                        id="description"
                        placeholder="Descrição do produto"
                        rows={3}
                        {...form.register("description")}
                    />
                    {form.formState.errors.description && (
                        <FieldError>{form.formState.errors.description.message}</FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="price">Preço (R$) *</FieldLabel>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        defaultValue={formatCentsToDisplay(form.getValues("price_cents"))}
                        onChange={(e) => {
                            form.setValue("price_cents", parseDisplayToCents(e.target.value));
                        }}
                    />
                    {form.formState.errors.price_cents && (
                        <FieldError>{form.formState.errors.price_cents.message}</FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="category">Categoria *</FieldLabel>
                    <Select
                        value={form.watch("category_id")?.toString() || ""}
                        onValueChange={(value) => form.setValue("category_id", parseInt(value))}
                        disabled={categoriesLoading}
                    >
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.formState.errors.category_id && (
                        <FieldError>{form.formState.errors.category_id.message}</FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="image_url">URL da Imagem</FieldLabel>
                    <Input
                        id="image_url"
                        type="url"
                        placeholder="https://exemplo.com/imagem.jpg"
                        {...form.register("image_url")}
                    />
                    {form.formState.errors.image_url && (
                        <FieldError>{form.formState.errors.image_url.message}</FieldError>
                    )}
                </Field>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
            </FieldGroup>
        </form>
    );
}
