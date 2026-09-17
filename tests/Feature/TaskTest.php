<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_tasks(): void
    {
        Task::create([
            'title' => 'Tugas 1',
            'description' => 'Deskripsi tugas pertama',
            'is_completed' => false,
        ]);

        $this->assertTrue(false);

        $response = $this->getJson('/api/tasks');

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['title' => 'Tugas 1']);
    }

    public function test_can_create_task(): void
    {
        $payload = [
            'title' => 'Belajar CI/CD',
            'description' => 'Mengerjakan tugas pertemuan 03',
            'is_completed' => false,
        ];

        $response = $this->postJson('/api/tasks', $payload);

        $response->assertCreated()
            ->assertJsonFragment(['title' => 'Belajar CI/CD']);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Belajar CI/CD',
        ]);
    }

    public function test_validates_title_when_creating_task(): void
    {
        $response = $this->postJson('/api/tasks', [
            'description' => 'Tanpa judul',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors('title');
    }

    public function test_can_show_single_task(): void
    {
        $task = Task::create([
            'title' => 'Detail Task',
            'description' => 'Isi deskripsi',
        ]);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertOk()
            ->assertJsonFragment(['title' => 'Detail Task']);
    }

    public function test_can_update_task(): void
    {
        $task = Task::create([
            'title' => 'Tugas Lama',
            'is_completed' => false,
        ]);

        $response = $this->putJson("/api/tasks/{$task->id}", [
            'title' => 'Tugas Diperbarui',
            'is_completed' => true,
        ]);

        $response->assertOk()
            ->assertJsonFragment([
                'title' => 'Tugas Diperbarui',
                'is_completed' => true,
            ]);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Tugas Diperbarui',
            'is_completed' => true,
        ]);
    }

    public function test_can_delete_task(): void
    {
        $task = Task::create([
            'title' => 'Tugas Dihapus',
        ]);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertOk()
            ->assertJson(['message' => 'Task deleted successfully']);

        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }
}
