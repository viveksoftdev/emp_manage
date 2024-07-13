# Generated by Django 3.2 on 2024-07-11 07:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=255)),
                ('age', models.PositiveIntegerField()),
                ('gender', models.CharField(choices=[('m', 'Male'), ('f', 'Female'), ('o', 'Others')], max_length=1)),
                ('phone', models.CharField(max_length=15)),
                ('address', models.TextField()),
                ('workExp', models.TextField()),
                ('qualifications', models.TextField()),
                ('projects', models.TextField()),
            ],
        ),
    ]
