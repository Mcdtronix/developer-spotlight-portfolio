# Generated manually on 2026-05-30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_experience_experiencesection_alter_project_options_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="project",
            options={"ordering": ["order", "id"]},
        ),
        migrations.AlterField(
            model_name="project",
            name="priority",
            field=models.PositiveIntegerField(
                default=0,
                help_text="Optional internal priority marker",
            ),
        ),
    ]
