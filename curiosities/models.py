from django.db import models
from django.contrib.auth.models import User

class Curiosity(models.Model):
    CATEGORY_CHOICES = [
        ('CRIACAO', 'Criação & Origem (1963)'),
        ('ARMADURAS', 'Armaduras & Tecnologia Arc'),
        ('DATAS', 'Datas Históricas & Linha do Tempo'),
        ('GIBIS', 'Gibis Clássicos & Sagas Históricas'),
        ('CROSSOVER', 'Vingadores & Homem-Aranha'),
        ('CURIOSIDADES', 'Curiosidades & Fatos'),
    ]

    title = models.CharField(max_length=255, verbose_name="Título")
    subtitle = models.CharField(max_length=255, blank=True, verbose_name="Subtítulo")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='CRIACAO', verbose_name="Categoria")
    date_or_era = models.CharField(max_length=100, verbose_name="Data / Época Histórica", help_text="Ex: Março de 1963, Guerra das Armaduras, Extremis")
    content = models.TextField(verbose_name="Conteúdo / História")
    comic_issue = models.CharField(max_length=150, blank=True, verbose_name="Gibi / Edição de Referência")
    image_filename = models.CharField(
        max_length=100, 
        blank=True, 
        default="ironman_1.jpg", 
        verbose_name="Arquivo de Imagem em /media/",
        help_text="Nome do arquivo dentro da pasta /media (ex: ironman_1.jpg, ironman_2.jpg)"
    )
    image_caption = models.CharField(max_length=255, blank=True, verbose_name="Legenda da Imagem")
    accent_color = models.CharField(max_length=30, default="#10b981", verbose_name="Cor de Destaque (Hex)")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordem de Exibição")
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='curiosities', verbose_name="Autor / Editor")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        verbose_name = "Curiosidade do Homem de Ferro"
        verbose_name_plural = "Curiosidades do Homem de Ferro"
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"[{self.get_category_display()}] {self.title} ({self.date_or_era})"
